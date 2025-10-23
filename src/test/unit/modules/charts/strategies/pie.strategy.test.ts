import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PieStrategy } from '@/modules/charts/strategies/pie.strategy';
import { SaleRepository } from '@/repositories/sale.repository';
import { ChartQuery } from '@/schemas/chart';

describe('PieStrategy', () => {
  let strategy: PieStrategy;
  let mockRepository: SaleRepository;

  beforeEach(() => {
    mockRepository = {
      aggregateByDimension: vi.fn(),
    } as any;
    strategy = new PieStrategy(mockRepository);
  });

  it('should execute pie chart strategy', async () => {
    const mockData = [
      { label: 'Electronics', value: 1000 },
      { label: 'Clothing', value: 500 },
    ];

    vi.mocked(mockRepository.aggregateByDimension).mockResolvedValue(mockData);

    const query: ChartQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      dimension: 'category',
      metric: 'sum(amount)',
      order: 'desc',
    };

    const result = await strategy.execute(query);

    expect(mockRepository.aggregateByDimension).toHaveBeenCalledWith(query, 'category');
    expect(result).toEqual(mockData);
  });

  it('should throw error when dimension is missing', async () => {
    const query: ChartQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      metric: 'sum(amount)',
      order: 'desc',
    };

    await expect(strategy.execute(query)).rejects.toThrow('Dimensão é obrigatória para gráficos de pizza');
  });
});
