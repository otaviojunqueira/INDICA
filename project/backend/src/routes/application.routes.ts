import express from 'express';
import { applicationController } from '../controllers/application.controller';
import authMiddleware, { isAgent, isAdmin } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = express.Router();

// Validação para criação/atualização de inscrição
const validateApplication = [
  body('noticeId').notEmpty().withMessage('Edital é obrigatório'),
  body('projectName').notEmpty().withMessage('Nome do projeto é obrigatório'),
  body('projectDescription').notEmpty().withMessage('Descrição do projeto é obrigatória'),
  body('requestedAmount').isNumeric().withMessage('Valor solicitado deve ser um número')
];

// Rotas para agentes culturais
router.post('/', authMiddleware, isAgent, validateApplication, applicationController.create);
router.get('/my-applications', authMiddleware, applicationController.listUserApplications);
router.get('/:id', authMiddleware, applicationController.getApplication);
router.put('/:id', authMiddleware, validateApplication, applicationController.update);
router.patch('/:id/submit', authMiddleware, applicationController.submit);

// Rotas de administrador
router.get('/', authMiddleware, isAdmin, applicationController.listAll);

export default router; 