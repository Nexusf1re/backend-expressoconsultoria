import { Sale, Prisma } from '@prisma/client';

export const mockSales: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    occurredAt: new Date('2024-01-01'),
    category: 'Electronics',
    product: 'Smartphone',
    amount: new Prisma.Decimal(500.00),
    region: 'North America',
    channel: 'Online',
  },
  {
    occurredAt: new Date('2024-01-02'),
    category: 'Electronics',
    product: 'Laptop',
    amount: new Prisma.Decimal(1200.00),
    region: 'Europe',
    channel: 'Store',
  },
  {
    occurredAt: new Date('2024-01-03'),
    category: 'Home & Garden',
    product: 'Garden Tools',
    amount: new Prisma.Decimal(150.00),
    region: 'Asia Pacific',
    channel: 'Online',
  },
  {
    occurredAt: new Date('2024-01-04'),
    category: 'Electronics',
    product: 'Headphones',
    amount: new Prisma.Decimal(200.00),
    region: 'North America',
    channel: 'Mobile App',
  },
  {
    occurredAt: new Date('2024-01-05'),
    category: 'Clothing',
    product: 'T-Shirt',
    amount: new Prisma.Decimal(25.00),
    region: 'Europe',
    channel: 'Online',
  },
];
