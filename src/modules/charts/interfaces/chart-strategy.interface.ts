import { ChartQuery } from '../../../schemas/chart';
import { PieDataPoint, SeriesResponse } from '../../../schemas/response';

/**
 * Interface para estratégias de geração de gráficos.
 */
export interface ChartStrategy {
  /**
   * Executa a estratégia específica para gerar dados do gráfico.
   * 
   * @param query - Parâmetros de filtro e configuração para o gráfico
   * @returns Dados formatados para o tipo de gráfico específico
   */
  execute(query: ChartQuery): Promise<PieDataPoint[] | SeriesResponse>;
}
