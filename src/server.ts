import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/database';

/**
 * Inicia o servidor da aplicação.
 */
async function startServer(): Promise<void> {
  try {
    // Conecta ao banco de dados
    await prisma.$connect();
    logger.info('Banco de dados conectado com sucesso');

    // Cria e inicia a aplicação
    const app = createApp();
    
    // Inicia o servidor HTTP
    const server = app.listen(env.PORT, () => {
      logger.info(`Servidor rodando na porta ${env.PORT}`, {
        port: env.PORT,
        ambiente: env.NODE_ENV,
        documentacao: `http://localhost:${env.PORT}/docs`,
        api: `http://localhost:${env.PORT}`,
        health: `http://localhost:${env.PORT}/health`
      });
    });

    // Configuração de shutdown graceful
    const gracefulShutdown = (signal: string) => {
      logger.info(`Recebido sinal ${signal}, iniciando shutdown graceful`);
      
      server.close(async () => {
        logger.info('Servidor HTTP fechado');
        
        try {
          await prisma.$disconnect();
          logger.info('Conexão com banco de dados encerrada');
          process.exit(0);
        } catch (error) {
          logger.error('Erro durante o shutdown', { error });
          process.exit(1);
        }
      });
    };

    // Listeners para sinais de sistema
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Falha ao iniciar o servidor', { error });
    process.exit(1);
  }
}

// Inicia a aplicação
startServer();
