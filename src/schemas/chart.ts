import { z } from 'zod';

/**
 * Schema para tipos de gráficos suportados.
 */
export const ChartTypeSchema = z.enum(['pie', 'line', 'bar', 'area']);

/**
 * Schema para períodos de agrupamento temporal.
 */
export const GroupBySchema = z.enum(['day', 'week', 'month']);

/**
 * Schema para dimensões de agrupamento.
 */
export const DimensionSchema = z.enum(['category', 'region', 'product', 'channel']);

/**
 * Schema para métricas de cálculo.
 */
export const MetricSchema = z.enum(['sum(amount)', 'avg(amount)', 'count(*)']);

/**
 * Schema principal para parâmetros de consulta de gráficos.
 */
export const ChartQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de início deve estar no formato YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de fim deve estar no formato YYYY-MM-DD'),
  groupBy: GroupBySchema.optional(), // Agrupamento temporal (obrigatório para line/area)
  dimension: DimensionSchema.optional(), // Dimensão de agrupamento (obrigatório para pie/bar)
  metric: MetricSchema.default('sum(amount)'), // Métrica de cálculo (padrão: soma dos valores)
  limit: z.coerce.number().min(1).max(100).optional(), // Limite de resultados (1-100)
  order: z.enum(['asc', 'desc']).default('desc'), // Ordem de classificação (padrão: decrescente)
  splitBy: DimensionSchema.optional(), // Dimensão para divisão de séries (obrigatório para area)
}).refine(
  (data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return startDate <= endDate;
  },
  {
    message: 'startDate must be less than or equal to endDate',
    path: ['startDate'],
  }
).refine(
  (data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= 365; // Max 1 year range
  },
  {
    message: 'Date range must not exceed 365 days',
    path: ['endDate'],
  }
);

export type ChartType = z.infer<typeof ChartTypeSchema>;
export type GroupBy = z.infer<typeof GroupBySchema>;
export type Dimension = z.infer<typeof DimensionSchema>;
export type Metric = z.infer<typeof MetricSchema>;
export type ChartQuery = z.infer<typeof ChartQuerySchema>;
