import { ChartQuery } from '../../../schemas/chart';
import { PieDataPoint } from '../../../schemas/response';
import { ChartStrategy } from '../interfaces/chart-strategy.interface';
import { SaleRepository } from '../../../repositories/sale.repository';

/**
 * Estratégia para gráficos de pizza.
 */
export class PieStrategy implements ChartStrategy {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(query: ChartQuery): Promise<PieDataPoint[]> {
    if (!query.dimension) {
      throw new Error('Dimensão é obrigatória para gráficos de pizza');
    }

    return this.saleRepository.aggregateByDimension(query, query.dimension);
  }
}
