import { Metric } from '../schemas/chart';

/**
 * Analisa uma métrica em formato string e extrai o campo e operação.
 * 
 * Converte métricas como "sum(amount)", "avg(amount)", "count(*)" em
 * objetos estruturados que podem ser usados pelo Prisma ORM.
 * 
 * @param metric - Métrica no formato string (ex: "sum(amount)", "count(*)")
 * @returns Objeto com campo e operação extraídos
 * @throws Error se o formato da métrica for inválido
 */
export function parseMetric(metric: Metric): {
  field: string;
  operation: 'sum' | 'avg' | 'count';
} {
  // Caso especial para contagem de registros
  if (metric === 'count(*)') {
    return { field: '*', operation: 'count' };
  }

  // Extrai operação e campo usando regex
  const match = metric.match(/^(sum|avg)\((\w+)\)$/);
  if (!match) {
    throw new Error(`Formato de métrica inválido: ${metric}`);
  }

  return {
    field: match[2]!, // Nome do campo (ex: "amount")
    operation: match[1] as 'sum' | 'avg', // Operação (sum ou avg)
  };
}

/**
 * Converte operação e campo em configuração de agregação do Prisma.
 * 
 * Transforma operações matemáticas em objetos de configuração que o Prisma
 * pode usar para realizar agregações no banco de dados.
 * 
 * @param field - Nome do campo para agregação
 * @param operation - Tipo de operação (sum, avg, count)
 * @returns Configuração de agregação para o Prisma
 * @throws Error se a operação não for suportada
 */
export function getPrismaAggregation(
  field: string,
  operation: 'sum' | 'avg' | 'count'
): Record<string, unknown> {
  switch (operation) {
    case 'sum':
      return { _sum: { [field]: true } }; // Soma dos valores do campo
    case 'avg':
      return { _avg: { [field]: true } }; // Média dos valores do campo
    case 'count':
      // Para count(*), usamos _count: true, para count(field) usamos _count: { field: true }
      if (field === '*') {
        return { _count: true }; // Contagem de todos os registros
      }
      return { _count: { [field]: true } }; // Contagem de registros não-nulos do campo
    default:
      throw new Error(`Operação não suportada: ${operation}`);
  }
}
