import { ChartQuery } from '../../../schemas/chart';
import { SeriesResponse } from '../../../schemas/response';
import { ChartStrategy } from '../interfaces/chart-strategy.interface';
import { SaleRepository } from '../../../repositories/sale.repository';

/**
 * Estratégia para gráficos de barras.
 */
export class BarStrategy implements ChartStrategy {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(query: ChartQuery): Promise<SeriesResponse> {
    if (!query.dimension) {
      throw new Error('Dimensão é obrigatória para gráficos de barras');
    }

    const aggregated = await this.saleRepository.aggregateByDimension(
      query,
      query.dimension
    );

    return {
      labels: aggregated.map((item) => item.label),
      datasets: [
        {
          label: 'Total',
          data: aggregated.map((item) => item.value),
        },
      ],
    };
  }
}
