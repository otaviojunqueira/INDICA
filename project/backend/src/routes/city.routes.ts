import { Router } from 'express';
import { cityController } from '../controllers/city.controller';
import authMiddleware from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Validação para criação/atualização de cidade
const validateCity = [
  body('name').notEmpty().withMessage('Nome da cidade é obrigatório'),
  body('state').notEmpty().withMessage('Estado é obrigatório'),
  body('stateCode').isLength({ min: 2, max: 2 }).withMessage('Código do estado deve ter 2 caracteres'),
  body('ibgeCode').notEmpty().withMessage('Código IBGE é obrigatório')
];

// Rotas públicas
router.get('/', cityController.listCities);
router.get('/:id', cityController.getCityById);

// Rotas protegidas (apenas admin)
router.post('/', authMiddleware, validateCity, cityController.createCity);
router.put('/:id', authMiddleware, validateCity, cityController.updateCity);
router.delete('/:id', authMiddleware, cityController.deleteCity);
router.post('/import', authMiddleware, cityController.importCities);

export default router; 