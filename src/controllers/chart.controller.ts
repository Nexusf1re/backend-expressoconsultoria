import { Request, Response } from 'express';
import { ChartQuerySchema, ChartTypeSchema } from '../schemas/chart';
import { ChartService } from '../modules/charts/services/chart.service';
import { SaleRepository } from '../repositories/sale.repository';
import { logger } from '../config/logger';

/**
 * Controller para processamento de requisições de gráficos.
 */
export class ChartController {
  private readonly chartService: ChartService;

  constructor() {
    const saleRepository = new SaleRepository();
    this.chartService = new ChartService(saleRepository);
  }

  /**
   * Processa requisição para gerar dados de gráfico.
   */
  async getChartData(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const query = req.query;

      // Valida tipo de gráfico
      const chartType = ChartTypeSchema.parse(type);

      // Valida parâmetros da query
      const validatedQuery = ChartQuerySchema.parse(query);

      logger.info('Processando requisição de gráfico', {
        tipo: chartType,
        parametros: validatedQuery,
        requestId: req.id
      });

      // Processa dados e gera gráfico
      const data = await this.chartService.getChartData(chartType, validatedQuery);

      res.json(data);
    } catch (error) {
      logger.error('Erro ao processar requisição de gráfico', { 
        error: error instanceof Error ? error.message : error,
        requestId: req.id 
      });

      if (error instanceof Error) {
        if (error.message.includes('required')) {
          res.status(400).json({
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Parâmetros obrigatórios não fornecidos: ' + error.message,
              suggestion: 'Verifique a documentação em /docs para ver os parâmetros necessários'
            },
          });
          return;
        }

        if (error.message.includes('Dimension is required') || 
            error.message.includes('groupBy is required') ||
            error.message.includes('splitBy is required')) {
          res.status(422).json({
            error: {
              code: 'INCOMPATIBLE_PARAMETERS',
              message: 'Combinação de parâmetros incompatível: ' + error.message,
              suggestion: 'Verifique se os parâmetros são adequados para o tipo de gráfico solicitado'
            },
          });
          return;
        }
      }

      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Ocorreu um erro interno no servidor',
          suggestion: 'Tente novamente em alguns instantes ou entre em contato com o suporte'
        },
      });
    }
  }
}
