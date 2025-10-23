import { describe, it, expect } from 'vitest';
import { parseMetric, getPrismaAggregation } from '@/utils/metric';

describe('Metric Utils', () => {
  describe('parseMetric', () => {
    it('should parse sum metric', () => {
      const result = parseMetric('sum(amount)');
      expect(result).toEqual({ field: 'amount', operation: 'sum' });
    });

    it('should parse avg metric', () => {
      const result = parseMetric('avg(amount)');
      expect(result).toEqual({ field: 'amount', operation: 'avg' });
    });

    it('should parse count metric', () => {
      const result = parseMetric('count(*)');
      expect(result).toEqual({ field: '*', operation: 'count' });
    });

    it('should throw error for invalid metric', () => {
      expect(() => parseMetric('invalid(amount)')).toThrow('Invalid metric format');
    });
  });

  describe('getPrismaAggregation', () => {
    it('should return sum aggregation', () => {
      const result = getPrismaAggregation('amount', 'sum');
      expect(result).toEqual({ _sum: { amount: true } });
    });

    it('should return avg aggregation', () => {
      const result = getPrismaAggregation('amount', 'avg');
      expect(result).toEqual({ _avg: { amount: true } });
    });

    it('should return count aggregation', () => {
      const result = getPrismaAggregation('amount', 'count');
      expect(result).toEqual({ _count: { amount: true } });
    });

    it('should throw error for unsupported operation', () => {
      expect(() => getPrismaAggregation('amount', 'max' as any)).toThrow('Unsupported operation');
    });
  });
});
