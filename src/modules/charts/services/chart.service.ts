import { ChartQuery, ChartType } from '../../schemas/chart';
import { PieDataPoint, SeriesResponse } from '../../schemas/response';
import { ChartFactory } from '../factories/chart.factory';
import { SaleRepository } from '../../repositories/sale.repository';

/**
 * Serviço para geração de dados de gráficos.
 */
export class ChartService {
  private readonly chartFactory: ChartFactory;

  constructor(private readonly saleRepository: SaleRepository) {
    this.chartFactory = new ChartFactory(saleRepository);
  }

  /**
   * Gera dados para o tipo de gráfico solicitado.
   */
  async getChartData(type: ChartType, query: ChartQuery): Promise<PieDataPoint[] | SeriesResponse> {
    // Cria estratégia para o tipo de gráfico
    const strategy = this.chartFactory.createStrategy(type);
    
    // Executa estratégia e retorna dados
    return strategy.execute(query);
  }
}
