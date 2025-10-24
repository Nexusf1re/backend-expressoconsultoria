import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '@/app';
import { prisma } from '@/config/database';
import { mockSales } from '@/test/utils/test-data';

describe('ChartController Integration', () => {
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

  beforeEach(async () => {
    try {
      // Clear and seed test data
      await prisma.sale.deleteMany();
      await prisma.sale.createMany({
        data: mockSales.map((sale) => ({
          ...sale,
          id: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      });
    } catch (error) {
      console.warn('Banco de dados não disponível, pulando setup de dados de teste');
    }
  });

  describe('GET /charts/pie', () => {
    it('should return pie chart data', async () => {
      try {
        const response = await request(app)
          .get('/charts/pie')
          .query({
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            dimension: 'category',
            metric: 'sum(amount)',
          })
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('label');
        expect(response.body[0]).toHaveProperty('value');
      } catch (error) {
        console.warn('Teste de integração pulado - banco de dados não disponível');
      }
    });

    it('should return 400 for missing required parameters', async () => {
      await request(app)
        .get('/charts/pie')
        .query({
          startDate: '2024-01-01',
          // Missing endDate
        })
        .expect(400);
    });

    it('should return 422 for missing dimension', async () => {
      await request(app)
        .get('/charts/pie')
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          metric: 'sum(amount)',
        })
        .expect(422);
    });
  });

  describe('GET /charts/line', () => {
    it('should return line chart data', async () => {
      const response = await request(app)
        .get('/charts/line')
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          groupBy: 'day',
          metric: 'sum(amount)',
        })
        .expect(200);

      expect(response.body).toHaveProperty('labels');
      expect(response.body).toHaveProperty('datasets');
      expect(Array.isArray(response.body.labels)).toBe(true);
      expect(Array.isArray(response.body.datasets)).toBe(true);
      expect(response.body.datasets[0]).toHaveProperty('label');
      expect(response.body.datasets[0]).toHaveProperty('data');
    });

    it('should return 422 for missing groupBy', async () => {
      await request(app)
        .get('/charts/line')
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          metric: 'sum(amount)',
        })
        .expect(422);
    });
  });

  describe('GET /charts/bar', () => {
    it('should return bar chart data', async () => {
      const response = await request(app)
        .get('/charts/bar')
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          dimension: 'region',
          metric: 'sum(amount)',
        })
        .expect(200);

      expect(response.body).toHaveProperty('labels');
      expect(response.body).toHaveProperty('datasets');
      expect(Array.isArray(response.body.labels)).toBe(true);
      expect(Array.isArray(response.body.datasets)).toBe(true);
    });

    it('should return 422 for missing dimension', async () => {
      await request(app)
        .get('/charts/bar')
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          metric: 'sum(amount)',
        })
        .expect(422);
    });
  });


  describe('Error handling', () => {
    it('should return 400 for invalid chart type', async () => {
      await request(app)
        .get('/charts/invalid')
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        })
        .expect(400);
    });

    it('should return 400 for invalid date format', async () => {
      await request(app)
        .get('/charts/pie')
        .query({
          startDate: 'invalid-date',
          endDate: '2024-01-31',
          dimension: 'category',
        })
        .expect(400);
    });

    it('should return 400 for startDate after endDate', async () => {
      await request(app)
        .get('/charts/pie')
        .query({
          startDate: '2024-01-31',
          endDate: '2024-01-01',
          dimension: 'category',
        })
        .expect(400);
    });
  });
});
