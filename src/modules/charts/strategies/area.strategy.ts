import { ChartQuery } from '../../../schemas/chart';
import { SeriesResponse } from '../../../schemas/response';
import { ChartStrategy } from '../interfaces/chart-strategy.interface';
import { SaleRepository } from '../../../repositories/sale.repository';

/**
 * Estratégia para gráficos de área.
 */
export class AreaStrategy implements ChartStrategy {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(query: ChartQuery): Promise<SeriesResponse> {
    if (!query.groupBy) {
      throw new Error('Agrupamento temporal (groupBy) é obrigatório para gráficos de área');
    }

    if (!query.splitBy) {
      throw new Error('Dimensão de divisão (splitBy) é obrigatória para gráficos de área');
    }

    const splitSeries = await this.saleRepository.getSplitSeries(
      query,
      query.groupBy,
      query.splitBy
    );

    if (splitSeries.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Obtém todos os valores únicos da dimensão de divisão
    const splitValues = Object.keys(splitSeries[0]!).filter(
      (key) => key !== 'date'
    );

    return {
      labels: splitSeries.map((item) => item.date),
      datasets: splitValues.map((splitValue) => ({
        label: splitValue,
        data: splitSeries.map((item) => Number(item[splitValue]) || 0),
      })),
    };
  }
}
