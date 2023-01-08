import { Router } from 'express';
import FindScheduleController from './controllers/FindScheduleController';

const routes = Router();

routes.get('/schedule', FindScheduleController.findSchedules);

export { routes };
