import { Router } from 'express';
import { evaluatorController } from '../controllers/evaluator.controller';
import authMiddleware from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Validação para criação/atualização de parecerista
const validateEvaluator = [
  body('userId').notEmpty().withMessage('Usuário é obrigatório'),
  body('specialties').isArray({ min: 1 }).withMessage('Pelo menos uma especialidade é obrigatória'),
  body('biography').notEmpty().withMessage('Biografia é obrigatória'),
  body('education').notEmpty().withMessage('Formação é obrigatória'),
  body('experience').notEmpty().withMessage('Experiência é obrigatória')
];

// Todas as rotas de pareceristas requerem autenticação
router.use(authMiddleware);

// Rotas para listar e obter
router.get('/', evaluatorController.listEvaluators);
router.get('/:id', evaluatorController.getEvaluatorById);

// Rotas para criação e atualização (admin)
router.post('/', validateEvaluator, evaluatorController.createEvaluator);
router.put('/:id', validateEvaluator, evaluatorController.updateEvaluator);

// Rota para ativar/desativar (admin)
router.patch('/:id/status', evaluatorController.toggleEvaluatorStatus);

export default router; 