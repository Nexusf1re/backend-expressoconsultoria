import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { HealthResponse } from '../schemas/response';

/**
 * Controller para verificação de saúde da aplicação.
 */
export class HealthController {
  /**
   * Verifica o status da aplicação e banco de dados.
   */
  async getHealth(_req: Request, res: Response): Promise<void> {
    try {
      // Testa conexão com banco de dados
      await prisma.$queryRaw`SELECT 1`;
      
      const health: HealthResponse = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
      };

      res.json(health);
    } catch (error) {
      const health: HealthResponse = {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'disconnected',
      };

      res.status(503).json(health);
    }
  }
}
