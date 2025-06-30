import { Router } from 'express';
import { getCities, getCityById, getCitiesByState } from '../controllers/city.controller';

const router = Router();

// Rotas de consulta
router.get('/', getCities);
router.get('/:id', getCityById);
router.get('/state/:state', getCitiesByState);

export default router; 