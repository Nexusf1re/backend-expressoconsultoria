import { Router } from 'express';
import { ChartController } from '../controllers/chart.controller';

const router = Router();
const chartController = new ChartController();

router.get('/:type', (req, res) => chartController.getChartData(req, res));

export { router as chartRoutes };
