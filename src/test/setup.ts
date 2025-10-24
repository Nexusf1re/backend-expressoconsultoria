import { beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Configuração para testes usando MySQL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env['DATABASE_URL'] || 'mysql://root:root@localhost:3306/analytics_test',
    },
  },
});

beforeAll(async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    console.warn('Não foi possível conectar ao banco de dados para testes:', error);
    console.warn('Testes unitários podem continuar sem banco de dados');
  }
});

afterAll(async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.warn('Erro ao desconectar do banco de dados:', error);
  }
});

export { prisma };
