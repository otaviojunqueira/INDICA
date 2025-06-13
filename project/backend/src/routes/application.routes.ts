import express from 'express';
import { applicationController } from '../controllers/application.controller';
import { authenticate, isAdmin, isAgent } from '../middleware/auth.middleware';
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
router.post('/', authenticate, isAgent, validateApplication, applicationController.create);
router.get('/my-applications', authenticate, applicationController.listUserApplications);
router.get('/:id', authenticate, applicationController.getApplication);
router.put('/:id', authenticate, validateApplication, applicationController.update);
router.patch('/:id/submit', authenticate, applicationController.submit);

// Rotas de administrador
router.get('/', authenticate, isAdmin, applicationController.listAll);

export default router; 