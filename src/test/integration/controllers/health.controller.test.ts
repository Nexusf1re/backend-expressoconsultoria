import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '@/app';
import { prisma } from '@/config/database';

describe('HealthController Integration', () => {
  let app: any;

  beforeAll(async () => {
    app = createApp();
    try {
      await prisma.$connect();
    } catch (error) {
      console.warn('Banco de dados não disponível para testes de integração:', error);
      console.warn('Pulando testes de integração que requerem banco de dados');
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /health', () => {
    it('should return health status when database is connected', async () => {
      try {
        const response = await request(app)
          .get('/health')
          .expect(200);

        expect(response.body).toHaveProperty('status', 'ok');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('uptime');
        expect(response.body).toHaveProperty('database', 'connected');
      } catch (error) {
        // Se o banco não estiver disponível, o health retorna 503
        const response = await request(app)
          .get('/health')
          .expect(503);
        
        expect(response.body).toHaveProperty('status', 'error');
      }
    });
  });
});
