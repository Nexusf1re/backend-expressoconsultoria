import { describe, it, expect } from 'vitest';
import { generateDateRange, fillMissingDates } from '@/utils/date';

describe('Date Utils', () => {
  describe('generateDateRange', () => {
    it('should generate daily range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-03');
      const result = generateDateRange(startDate, endDate, 'day');

      expect(result).toEqual(['2024-01-01', '2024-01-02', '2024-01-03']);
    });

    it('should generate weekly range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-15');
      const result = generateDateRange(startDate, endDate, 'week');

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('2024-01-01'); // Week starts on the same day
    });

    it('should generate monthly range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-03-31');
      const result = generateDateRange(startDate, endDate, 'month');

      expect(result).toEqual(['2023-12-01', '2024-01-01', '2024-03-01']);
    });
  });

  describe('fillMissingDates', () => {
    it('should fill missing dates with default value', () => {
      const data = [
        { date: '2024-01-01', value: 100 },
        { date: '2024-01-03', value: 300 },
      ];
      const dateRange = ['2024-01-01', '2024-01-02', '2024-01-03'];

      const result = fillMissingDates(data, dateRange, 0);

      expect(result).toEqual([
        { date: '2024-01-01', value: 100 },
        { date: '2024-01-02', value: 0 },
        { date: '2024-01-03', value: 300 },
      ]);
    });

    it('should fill missing dates with custom value', () => {
      const data = [{ date: '2024-01-01', value: 100 }];
      const dateRange = ['2024-01-01', '2024-01-02'];

      const result = fillMissingDates(data, dateRange, 50);

      expect(result).toEqual([
        { date: '2024-01-01', value: 100 },
        { date: '2024-01-02', value: 50 },
      ]);
    });
  });
});
