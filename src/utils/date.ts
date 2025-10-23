import { GroupBy } from '../schemas/chart';

/**
 * Gera um array de datas no formato apropriado para agrupamento temporal.
 * 
 * Esta função cria uma sequência completa de datas entre startDate e endDate,
 * formatadas de acordo com o período de agrupamento (dia, semana, mês).
 * É essencial para garantir que gráficos temporais tenham todos os períodos,
 * mesmo quando não há dados para alguns períodos.
 * 
 * @param startDate - Data de início do período
 * @param endDate - Data de fim do período
 * @param groupBy - Período de agrupamento (day, week, month)
 * @returns Array de strings com datas formatadas
 */
export function generateDateRange(
  startDate: Date,
  endDate: Date,
  groupBy: GroupBy
): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);

  // Gera todas as datas no intervalo especificado
  while (current <= endDate) {
    dates.push(formatDateForGrouping(current, groupBy));
    incrementDate(current, groupBy);
  }

  return dates;
}

function formatDateForGrouping(date: Date, groupBy: GroupBy): string {
  switch (groupBy) {
    case 'day':
      return date.toISOString().split('T')[0];
    case 'week':
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      return weekStart.toISOString().split('T')[0];
    case 'month':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    default:
      return date.toISOString().split('T')[0];
  }
}

function incrementDate(date: Date, groupBy: GroupBy): void {
  switch (groupBy) {
    case 'day':
      date.setDate(date.getDate() + 1);
      break;
    case 'week':
      date.setDate(date.getDate() + 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() + 1);
      break;
  }
}

/**
 * Preenche datas ausentes em séries temporais com valores padrão.
 * 
 * Esta função garante que gráficos temporais tenham dados para todos os períodos,
 * preenchendo lacunas com valores padrão (geralmente 0). Isso evita que
 * gráficos tenham "buracos" quando não há dados para alguns períodos.
 * 
 * @param data - Array de dados existentes com data e valor
 * @param dateRange - Array completo de datas que devem estar presentes
 * @param fillValue - Valor para preencher datas ausentes (padrão: 0)
 * @returns Array completo de dados com todas as datas preenchidas
 */
export function fillMissingDates(
  data: Array<{ date: string; value: number }>,
  dateRange: string[],
  fillValue = 0
): Array<{ date: string; value: number }> {
  // Cria um mapa para busca rápida dos dados existentes
  const dataMap = new Map(data.map(item => [item.date, item.value]));
  
  // Preenche todas as datas, usando dados existentes ou valor padrão
  return dateRange.map(date => ({
    date,
    value: dataMap.get(date) ?? fillValue,
  }));
}
