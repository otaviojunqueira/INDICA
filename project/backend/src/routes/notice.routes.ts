import express from 'express';
import { noticeController } from '../controllers/notice.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = express.Router();

// Validação para criação/atualização de edital
const validateNotice = [
  body('title').notEmpty().withMessage('Título é obrigatório'),
  body('description').notEmpty().withMessage('Descrição é obrigatória'),
  body('entityId').notEmpty().withMessage('Entidade é obrigatória'),
  body('startDate').isISO8601().withMessage('Data de início inválida'),
  body('endDate').isISO8601().withMessage('Data de término inválida'),
  body('totalAmount').isNumeric().withMessage('Valor total deve ser um número'),
  body('maxApplicationValue').isNumeric().withMessage('Valor máximo por inscrição deve ser um número'),
  body('minApplicationValue').isNumeric().withMessage('Valor mínimo por inscrição deve ser um número')
];

// Rotas públicas
router.get('/', noticeController.listAll);
router.get('/:id', noticeController.getNotice);

// Rotas de administrador
router.post('/', authenticate, isAdmin, validateNotice, noticeController.create);
router.put('/:id', authenticate, isAdmin, validateNotice, noticeController.update);
router.delete('/:id', authenticate, isAdmin, noticeController.delete);
router.patch('/:id/publish', authenticate, isAdmin, noticeController.publish);

export default router; 