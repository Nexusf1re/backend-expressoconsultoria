import { Request, Response } from 'express';
import { ChartQuerySchema, ChartTypeSchema } from '../schemas/chart';
import { ChartService } from '../modules/charts/services/chart.service';
import { SaleRepository } from '../repositories/sale.repository';
import { logger } from '../config/logger';
import { ZodError } from 'zod';

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

      // Trata erros de validação do Zod
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        
        if (!firstError) {
          res.status(400).json({
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Erro de validação desconhecido',
              suggestion: 'Verifique os parâmetros fornecidos'
            },
          });
          return;
        }
        
        // Erro de tipo de gráfico inválido
        if (firstError.path.length === 0 && firstError.code === 'invalid_enum_value') {
          res.status(400).json({
            error: {
              code: 'INVALID_CHART_TYPE',
              message: 'Tipo de gráfico inválido',
              suggestion: 'Tipos suportados: pie, line, bar'
            },
          });
          return;
        }

        // Erro de formato de data
        if (firstError.path.includes('startDate') || firstError.path.includes('endDate')) {
          res.status(400).json({
            error: {
              code: 'INVALID_DATE_FORMAT',
              message: firstError.message,
              suggestion: 'Use o formato YYYY-MM-DD para as datas'
            },
          });
          return;
        }

        // Erro de range de datas
        if (firstError.path.includes('startDate') && firstError.message.includes('must be less than or equal to endDate')) {
          res.status(400).json({
            error: {
              code: 'INVALID_DATE_RANGE',
              message: 'Data de início deve ser anterior à data de fim',
              suggestion: 'Verifique se startDate <= endDate'
            },
          });
          return;
        }

        // Erro de range muito longo
        if (firstError.path.includes('endDate') && firstError.message.includes('must not exceed 365 days')) {
          res.status(400).json({
            error: {
              code: 'DATE_RANGE_TOO_LONG',
              message: 'Período não pode exceder 365 dias',
              suggestion: 'Reduza o intervalo de datas'
            },
          });
          return;
        }

        // Outros erros de validação
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: firstError.message,
            suggestion: 'Verifique os parâmetros fornecidos'
          },
        });
        return;
      }

      // Trata erros de negócio (validações específicas dos gráficos)
      if (error instanceof Error) {
        if (error.message.includes('Dimensão é obrigatória') || 
            error.message.includes('Agrupamento temporal') ||
            error.message.includes('Dimensão de divisão')) {
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
