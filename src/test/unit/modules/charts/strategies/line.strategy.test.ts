import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LineStrategy } from '@/modules/charts/strategies/line.strategy';
import { SaleRepository } from '@/repositories/sale.repository';
import { ChartQuery } from '@/schemas/chart';

describe('LineStrategy', () => {
  let strategy: LineStrategy;
  let mockRepository: SaleRepository;

  beforeEach(() => {
    mockRepository = {
      getTimeSeries: vi.fn(),
    } as any;
    strategy = new LineStrategy(mockRepository);
  });

  it('should execute line chart strategy', async () => {
    const mockData = [
      { date: '2024-01-01', value: 100 },
      { date: '2024-01-02', value: 200 },
    ];

    vi.mocked(mockRepository.getTimeSeries).mockResolvedValue(mockData);

    const query: ChartQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      groupBy: 'day',
      metric: 'sum(amount)',
      order: 'desc',
    };

    const result = await strategy.execute(query);

    expect(mockRepository.getTimeSeries).toHaveBeenCalledWith(query, 'day');
    expect(result).toEqual({
      labels: ['2024-01-01', '2024-01-02'],
      datasets: [
        {
          label: 'Total',
          data: [100, 200],
        },
      ],
    });
  });

  it('should throw error when groupBy is missing', async () => {
    const query: ChartQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      metric: 'sum(amount)',
      order: 'desc',
    };

    await expect(strategy.execute(query)).rejects.toThrow('groupBy is required for line charts');
  });
});
