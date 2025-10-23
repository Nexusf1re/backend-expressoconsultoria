import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BarStrategy } from '@/modules/charts/strategies/bar.strategy';
import { SaleRepository } from '@/repositories/sale.repository';
import { ChartQuery } from '@/schemas/chart';

describe('BarStrategy', () => {
  let strategy: BarStrategy;
  let mockRepository: SaleRepository;

  beforeEach(() => {
    mockRepository = {
      aggregateByDimension: vi.fn(),
    } as any;
    strategy = new BarStrategy(mockRepository);
  });

  it('should execute bar chart strategy', async () => {
    const mockData = [
      { label: 'North America', value: 1000 },
      { label: 'Europe', value: 500 },
    ];

    vi.mocked(mockRepository.aggregateByDimension).mockResolvedValue(mockData);

    const query: ChartQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      dimension: 'region',
      metric: 'sum(amount)',
      order: 'desc',
    };

    const result = await strategy.execute(query);

    expect(mockRepository.aggregateByDimension).toHaveBeenCalledWith(query, 'region');
    expect(result).toEqual({
      labels: ['North America', 'Europe'],
      datasets: [
        {
          label: 'Total',
          data: [1000, 500],
        },
      ],
    });
  });

  it('should throw error when dimension is missing', async () => {
    const query: ChartQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      metric: 'sum(amount)',
      order: 'desc',
    };

    await expect(strategy.execute(query)).rejects.toThrow('Dimensão é obrigatória para gráficos de barras');
  });
});
