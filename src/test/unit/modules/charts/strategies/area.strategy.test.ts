import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AreaStrategy } from '@/modules/charts/strategies/area.strategy';
import { SaleRepository } from '@/repositories/sale.repository';
import { ChartQuery } from '@/schemas/chart';

describe('AreaStrategy', () => {
  let strategy: AreaStrategy;
  let mockRepository: SaleRepository;

  beforeEach(() => {
    mockRepository = {
      getSplitSeries: vi.fn(),
    } as any;
    strategy = new AreaStrategy(mockRepository);
  });

  it('should execute area chart strategy', async () => {
    const mockData = [
      { date: '2024-01-01', Online: 100, Store: 200 },
      { date: '2024-01-02', Online: 150, Store: 250 },
    ];

    vi.mocked(mockRepository.getSplitSeries).mockResolvedValue(mockData);

    const query: ChartQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      groupBy: 'day',
      splitBy: 'channel',
      metric: 'sum(amount)',
      order: 'desc',
    };

    const result = await strategy.execute(query);

    expect(mockRepository.getSplitSeries).toHaveBeenCalledWith(query, 'day', 'channel');
    expect(result).toEqual({
      labels: ['2024-01-01', '2024-01-02'],
      datasets: [
        {
          label: 'Online',
          data: [100, 150],
        },
        {
          label: 'Store',
          data: [200, 250],
        },
      ],
    });
  });

  it('should return empty result when no data', async () => {
    vi.mocked(mockRepository.getSplitSeries).mockResolvedValue([]);

    const query: ChartQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      groupBy: 'day',
      splitBy: 'channel',
      metric: 'sum(amount)',
      order: 'desc',
    };

    const result = await strategy.execute(query);

    expect(result).toEqual({
      labels: [],
      datasets: [],
    });
  });

  it('should throw error when groupBy is missing', async () => {
    const query: ChartQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      splitBy: 'channel',
      metric: 'sum(amount)',
      order: 'desc',
    };

    await expect(strategy.execute(query)).rejects.toThrow('Agrupamento temporal (groupBy) é obrigatório para gráficos de área');
  });

  it('should throw error when splitBy is missing', async () => {
    const query: ChartQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      groupBy: 'day',
      metric: 'sum(amount)',
      order: 'desc',
    };

    await expect(strategy.execute(query)).rejects.toThrow('Dimensão de divisão (splitBy) é obrigatória para gráficos de área');
  });
});
