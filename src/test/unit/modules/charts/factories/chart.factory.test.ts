import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChartFactory } from '@/modules/charts/factories/chart.factory';
import { SaleRepository } from '@/repositories/sale.repository';
import { PieStrategy } from '@/modules/charts/strategies/pie.strategy';
import { LineStrategy } from '@/modules/charts/strategies/line.strategy';
import { BarStrategy } from '@/modules/charts/strategies/bar.strategy';

// Mock the strategies
vi.mock('@/modules/charts/strategies/pie.strategy');
vi.mock('@/modules/charts/strategies/line.strategy');
vi.mock('@/modules/charts/strategies/bar.strategy');

describe('ChartFactory', () => {
  let factory: ChartFactory;
  let mockRepository: SaleRepository;

  beforeEach(() => {
    mockRepository = {} as SaleRepository;
    factory = new ChartFactory(mockRepository);
  });

  it('should create pie strategy', () => {
    const strategy = factory.createStrategy('pie');
    expect(strategy).toBeInstanceOf(PieStrategy);
  });

  it('should create line strategy', () => {
    const strategy = factory.createStrategy('line');
    expect(strategy).toBeInstanceOf(LineStrategy);
  });

  it('should create bar strategy', () => {
    const strategy = factory.createStrategy('bar');
    expect(strategy).toBeInstanceOf(BarStrategy);
  });


  it('should throw error for unsupported chart type', () => {
    expect(() => factory.createStrategy('unsupported' as any)).toThrow(
      'Unsupported chart type: unsupported'
    );
  });
});
