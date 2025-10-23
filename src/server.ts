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
      logger.info(`Servidor rodando na porta ${env.PORT}`);
      
      // Log dos endpoints principais
      console.log('\n=== ENDPOINTS DISPONÍVEIS ===');
      console.log(`   Health: http://localhost:${env.PORT}/health`);
      console.log(`   Charts: http://localhost:${env.PORT}/charts/{type}`);
      console.log(`   Docs:   http://localhost:${env.PORT}/docs`);
      
      // Log dos exemplos
      console.log('\n=== EXEMPLOS DE USO ===');
      console.log(`   Pizza:  http://localhost:${env.PORT}/charts/pie?dimension=category&startDate=2025-01-01&endDate=2025-12-31`);
      console.log(`   Linha:  http://localhost:${env.PORT}/charts/line?groupBy=day&startDate=2025-01-01&endDate=2025-12-31`);
      console.log(`   Barras: http://localhost:${env.PORT}/charts/bar?dimension=region&startDate=2025-01-01&endDate=2025-12-31`);
      console.log('');
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
