import { Router } from 'express';
import { evaluatorController } from '../controllers/evaluator.controller';
import authMiddleware, { isAdmin } from '../middleware/auth.middleware';
import { check } from 'express-validator';

const router = Router();

// Validação para criação e atualização de pareceristas
const evaluatorValidation = [
  check('userId').optional().isUUID().withMessage('ID de usuário inválido'),
  check('specialties')
    .isArray({ min: 1 })
    .withMessage('Pelo menos uma especialidade é obrigatória'),
  check('biography')
    .notEmpty()
    .withMessage('Biografia é obrigatória'),
  check('education')
    .notEmpty()
    .withMessage('Formação é obrigatória'),
  check('experience')
    .notEmpty()
    .withMessage('Experiência é obrigatória')
];

// Validação para atualização de status
const statusValidation = [
  check('isActive')
    .isBoolean()
    .withMessage('O campo isActive deve ser um booleano')
];

// Rotas públicas
router.get('/', evaluatorController.listEvaluators);
router.get('/:id', evaluatorController.getEvaluatorById);
router.get('/specialty/:specialty', evaluatorController.listEvaluatorsBySpecialty);

// Rotas protegidas (apenas para administradores)
router.post('/', authMiddleware, isAdmin, evaluatorValidation, evaluatorController.createEvaluator);
router.put('/:id', authMiddleware, isAdmin, evaluatorValidation, evaluatorController.updateEvaluator);
router.patch('/:id/status', authMiddleware, isAdmin, statusValidation, evaluatorController.updateEvaluatorStatus);
router.delete('/:id', authMiddleware, isAdmin, evaluatorController.deleteEvaluator);

export default router; 