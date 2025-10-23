import { ChartQuery } from '../../../schemas/chart';
import { SeriesResponse } from '../../../schemas/response';
import { ChartStrategy } from '../interfaces/chart-strategy.interface';
import { SaleRepository } from '../../../repositories/sale.repository';

/**
 * Estratégia para gráficos de linha.
 */
export class LineStrategy implements ChartStrategy {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(query: ChartQuery): Promise<SeriesResponse> {
    if (!query.groupBy) {
      throw new Error('Agrupamento temporal (groupBy) é obrigatório para gráficos de linha');
    }

    const timeSeries = await this.saleRepository.getTimeSeries(query, query.groupBy);

    return {
      labels: timeSeries.map((item) => item.date),
      datasets: [
        {
          label: 'Total',
          data: timeSeries.map((item) => item.value),
        },
      ],
    };
  }
}
