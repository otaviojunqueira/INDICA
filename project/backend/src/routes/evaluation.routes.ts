import express from 'express';
import { evaluationController } from '../controllers/evaluation.controller';
import authMiddleware, { isEvaluator, isAdmin } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = express.Router();

// Validação para criar avaliação
const validateCreateEvaluation = [
  body('applicationId').notEmpty().withMessage('ID da inscrição é obrigatório')
];

// Validação para atualizar avaliação
const validateUpdateEvaluation = [
  body('criteriaScores').optional().isArray().withMessage('Pontuações devem ser um array'),
  body('criteriaScores.*.criteriaId').optional().notEmpty().withMessage('ID do critério é obrigatório'),
  body('criteriaScores.*.score').optional().isNumeric().withMessage('Pontuação deve ser um número')
];

// Validação para designar avaliadores
const validateAssignEvaluators = [
  body('evaluatorIds').isArray().withMessage('IDs dos avaliadores devem ser um array'),
  body('evaluatorIds.*').notEmpty().withMessage('ID de avaliador inválido')
];

// Rotas para avaliadores
router.post('/', authMiddleware, isEvaluator, validateCreateEvaluation, evaluationController.create);
router.get('/my-evaluations', authMiddleware, isEvaluator, evaluationController.listEvaluatorEvaluations);
router.get('/:id', authMiddleware, isEvaluator, evaluationController.getEvaluation);
router.put('/:id', authMiddleware, isEvaluator, validateUpdateEvaluation, evaluationController.update);

// Rotas para administradores
router.get('/application/:applicationId', authMiddleware, isAdmin, evaluationController.listApplicationEvaluations);
router.post('/application/:applicationId/assign', authMiddleware, isAdmin, validateAssignEvaluators, evaluationController.assignEvaluators);

export default router; 