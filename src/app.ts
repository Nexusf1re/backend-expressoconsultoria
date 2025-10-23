import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { loggingMiddleware } from './middlewares/logging.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { chartRoutes } from './routes/chart.routes';
import { healthRoutes } from './routes/health.routes';
import { docsRoutes } from './routes/docs.routes';

/**
 * Cria e configura a aplicação Express.
 */
export function createApp(): express.Application {
  const app = express();

  // Middlewares de segurança
  app.use(helmet());
  app.use(cors());

  // Middleware de identificação de requisições
  app.use(requestIdMiddleware);

  // Middleware de logging
  app.use(loggingMiddleware);

  // Middlewares de parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Rotas da API
  app.use('/health', healthRoutes);
  app.use('/charts', chartRoutes);
  app.use('/docs', docsRoutes);

  // Endpoint raiz
  app.get('/', (req, res) => {
    res.json({
      message: 'Analytics API - Sua ferramenta para análise de dados',
      version: '1.0.0',
      description: 'API RESTful para geração dinâmica de gráficos e análises',
      endpoints: {
        health: '/health - Verificar status da aplicação',
        charts: '/charts/{type} - Gerar dados para gráficos',
        docs: '/docs - Documentação interativa',
      },
      examples: {
        pieChart: '/charts/pie?dimension=category&startDate=2024-01-01&endDate=2024-12-31',
        lineChart: '/charts/line?groupBy=day&startDate=2024-01-01&endDate=2024-12-31',
        barChart: '/charts/bar?dimension=region&startDate=2024-01-01&endDate=2024-12-31'
      }
    });
  });

  // Tratamento de rotas não encontradas
  app.use('*', (req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `A rota ${req.method} ${req.originalUrl} não foi encontrada`,
        suggestion: 'Verifique a documentação em /docs para ver as rotas disponíveis'
      },
    });
  });

  // Middleware global de tratamento de erros
  app.use(errorMiddleware);

  return app;
}
