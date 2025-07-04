import { Router } from 'express';
import { 
  getCities, 
  getCityById, 
  getCitiesByState,
  getCityByNameAndState,
  createCity,
  findOrCreateCity
} from '../controllers/city.controller';
import authMiddleware, { isAdmin } from '../middleware/auth.middleware';

const router = Router();

// Rotas públicas de consulta
router.get('/', getCities);
router.get('/search', getCityByNameAndState);
router.get('/state/:state', getCitiesByState);
router.get('/:id', getCityById);

// Rota para buscar ou criar cidade (pode ser usada pelo frontend durante o cadastro)
router.post('/find-or-create', findOrCreateCity);

// Rotas protegidas (apenas admin)
router.use(authMiddleware);
router.use(isAdmin);
router.post('/', createCity);

export default router; 