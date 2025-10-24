import { ChartType } from '../../../schemas/chart';
import { ChartStrategy } from '../interfaces/chart-strategy.interface';
import { PieStrategy } from '../strategies/pie.strategy';
import { LineStrategy } from '../strategies/line.strategy';
import { BarStrategy } from '../strategies/bar.strategy';
import { SaleRepository } from '../../../repositories/sale.repository';

export class ChartFactory {
  constructor(private readonly saleRepository: SaleRepository) {}

  createStrategy(type: ChartType): ChartStrategy {
    switch (type) {
      case 'pie':
        return new PieStrategy(this.saleRepository);
      case 'line':
        return new LineStrategy(this.saleRepository);
      case 'bar':
        return new BarStrategy(this.saleRepository);
      default:
        throw new Error(`Unsupported chart type: ${type}`);
    }
  }
}
