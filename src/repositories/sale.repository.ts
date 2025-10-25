import { prisma } from '../config/database';
import { ChartQuery, Dimension, GroupBy } from '../schemas/chart';
import { parseMetric, getPrismaAggregation } from '../utils/metric';
import { generateDateRange, fillMissingDates } from '../utils/date';

/**
 * Repositório para acesso a dados de vendas.
 */
export class SaleRepository {
  /**
   * Agrega dados de vendas por uma dimensão específica (categoria, região, produto, canal).
   * Este método é usado para gráficos de pizza e barras, onde precisamos agrupar
   * os dados por uma única dimensão e calcular métricas agregadas.
   * 
   * @param query - Parâmetros de filtro (data, métrica, limite, etc.)
   * @param dimension - Dimensão para agrupamento (category, region, product, channel)
   * @returns Array de objetos com label e value para o gráfico
   */
  async aggregateByDimension(
    query: ChartQuery,
    dimension: Dimension
  ): Promise<Array<{ label: string; value: number }>> {
    const { field, operation } = parseMetric(query.metric);
    const aggregation = getPrismaAggregation(field, operation);

    const results = await prisma.sale.groupBy({
      by: [dimension],
      where: {
        occurredAt: {
          gte: new Date(query.startDate),
          lte: new Date(query.endDate),
        },
      },
      ...aggregation,
    } as any);

    // Mapear resultados para incluir valores calculados
    const mappedResults = results.map((result) => ({
      label: result[dimension] as string,
      value: this.extractValue(result, operation, field),
    }));

    // Ordenar pelos valores ao invés do campo da dimensão
    const sortedResults = mappedResults.sort((a, b) => {
      if (query.order === 'desc') {
        return b.value - a.value;
      } else {
        return a.value - b.value;
      }
    });

    // Aplicar limite após ordenação
    return query.limit ? sortedResults.slice(0, query.limit) : sortedResults;
  }

  /**
   * Gera série temporal de dados de vendas agrupados por período.
   * Este método é usado para gráficos de linha, onde precisamos mostrar
   * a evolução dos dados ao longo do tempo (dia, semana, mês).
   * 
   * @param query - Parâmetros de filtro (data, métrica, etc.)
   * @param groupBy - Período de agrupamento (day, week, month)
   * @returns Array de objetos com data e valor para a série temporal
   */
  async getTimeSeries(
    query: ChartQuery,
    groupBy: GroupBy
  ): Promise<Array<{ date: string; value: number }>> {
    const { field, operation } = parseMetric(query.metric);
    const aggregation = getPrismaAggregation(field, operation);

    // Get raw data grouped by date
    const results = await prisma.sale.groupBy({
      by: ['occurredAt'],
      where: {
        occurredAt: {
          gte: new Date(query.startDate),
          lte: new Date(query.endDate),
        },
      },
      ...aggregation,
      orderBy: {
        occurredAt: 'asc',
      },
    });

    // Group by the appropriate time period
    const groupedData = this.groupByTimePeriod(results, groupBy, operation, field);

    // Generate complete date range and fill missing dates
    const dateRange = generateDateRange(
      new Date(query.startDate),
      new Date(query.endDate),
      groupBy
    );

    return fillMissingDates(groupedData, dateRange);
  }

  /**
   * Gera série temporal com dados divididos por uma dimensão específica.
   * Este método é usado para gráficos de área, onde precisamos mostrar
   * múltiplas séries temporais divididas por uma dimensão (ex: vendas por canal ao longo do tempo).
   * 
   * @param query - Parâmetros de filtro (data, métrica, etc.)
   * @param groupBy - Período de agrupamento (day, week, month)
   * @param splitBy - Dimensão para divisão das séries (category, region, product, channel)
   * @returns Array de objetos com data e valores para cada série
   */
  async getSplitSeries(
    query: ChartQuery,
    groupBy: GroupBy,
    splitBy: Dimension
  ): Promise<Array<{ date: string; [key: string]: string | number }>> {
    const { field, operation } = parseMetric(query.metric);
    const aggregation = getPrismaAggregation(field, operation);

    const results = await prisma.sale.groupBy({
      by: ['occurredAt', splitBy],
      where: {
        occurredAt: {
          gte: new Date(query.startDate),
          lte: new Date(query.endDate),
        },
      },
      ...aggregation,
      orderBy: {
        occurredAt: 'asc',
      },
    });

    // Group by time period and split dimension
    const groupedData = this.groupByTimePeriodAndSplit(
      results,
      groupBy,
      splitBy,
      operation,
      field
    );

    // Generate complete date range
    const dateRange = generateDateRange(
      new Date(query.startDate),
      new Date(query.endDate),
      groupBy
    );

    // Get all unique split values
    const splitValues = Array.from(
      new Set(results.map((r) => r[splitBy] as string))
    );

    // Fill missing dates for each split value
    return dateRange.map((date) => {
      const result: { date: string; [key: string]: string | number } = { date };
      
      splitValues.forEach((splitValue) => {
        const dataPoint = groupedData.find(
          (d) => d.date === date && d[splitBy] === splitValue
        );
        result[splitValue] = dataPoint ? this.extractValue(dataPoint, operation, field) : 0;
      });

      return result;
    });
  }

  private groupByTimePeriod(
    results: Array<{ occurredAt: Date; [key: string]: unknown }>,
    groupBy: GroupBy,
    operation: 'sum' | 'avg' | 'count',
    field: string
  ): Array<{ date: string; value: number }> {
    const grouped = new Map<string, { count: number; sum: number }>();

    results.forEach((result) => {
      const date = this.formatDateForGrouping(result.occurredAt, groupBy);
      const value = this.extractValue(result, operation, field);

      if (!grouped.has(date)) {
        grouped.set(date, { count: 0, sum: 0 });
      }

      const group = grouped.get(date)!;
      group.count += 1;
      group.sum += value;
    });

    return Array.from(grouped.entries()).map(([date, group]) => ({
      date,
      value: operation === 'avg' ? group.sum / group.count : group.sum,
    }));
  }

  private groupByTimePeriodAndSplit(
    results: Array<{ occurredAt: Date; [key: string]: unknown }>,
    groupBy: GroupBy,
    splitBy: Dimension,
    operation: 'sum' | 'avg' | 'count',
    field: string
  ): Array<{ date: string; [key: string]: string | number }> {
    const grouped = new Map<string, Map<string, { count: number; sum: number }>>();

    results.forEach((result) => {
      const date = this.formatDateForGrouping(result.occurredAt, groupBy);
      const splitValue = result[splitBy] as string;
      const value = this.extractValue(result, operation, field);

      if (!grouped.has(date)) {
        grouped.set(date, new Map());
      }

      const dateGroup = grouped.get(date)!;
      if (!dateGroup.has(splitValue)) {
        dateGroup.set(splitValue, { count: 0, sum: 0 });
      }

      const splitGroup = dateGroup.get(splitValue)!;
      splitGroup.count += 1;
      splitGroup.sum += value;
    });

    const result: Array<{ date: string; [key: string]: string | number }> = [];

    grouped.forEach((dateGroup, date) => {
      const dataPoint: { date: string; [key: string]: string | number } = { date };

      dateGroup.forEach((group, splitValue) => {
        dataPoint[splitValue] = operation === 'avg' ? group.sum / group.count : group.sum;
      });

      result.push(dataPoint);
    });

    return result;
  }

  private formatDateForGrouping(date: Date, groupBy: GroupBy): string {
    switch (groupBy) {
      case 'day':
        return date.toISOString().split('T')[0]!;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart.toISOString().split('T')[0]!;
      case 'month':
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
      default:
        return date.toISOString().split('T')[0]!;
    }
  }

  private extractValue(
    result: Record<string, unknown>,
    operation: 'sum' | 'avg' | 'count',
    field: string
  ): number {
    switch (operation) {
      case 'sum':
        return Number((result as any)[`_sum`]?.[field] || 0);
      case 'avg':
        return Number((result as any)[`_avg`]?.[field] || 0);
      case 'count':
        // Para count(*), o resultado vem em _count diretamente
        if (field === '*') {
          return Number((result as any)[`_count`] || 0);
        }
        return Number((result as any)[`_count`]?.[field] || 0);
      default:
        return 0;
    }
  }
}
