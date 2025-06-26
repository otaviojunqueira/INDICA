import { Router } from 'express';
import { noticeController } from '../controllers/notice.controller';
import authMiddleware from '../middleware/auth.middleware';
import { noticePreferenceMiddleware } from '../middleware/noticePreference.middleware';
import { body } from 'express-validator';

const router = Router();

// Validação para criação/atualização de edital
const validateNotice = [
  body('title').notEmpty().withMessage('O título é obrigatório'),
  body('description').notEmpty().withMessage('A descrição é obrigatória'),
  body('entityId').notEmpty().withMessage('Entidade é obrigatória'),
  body('cityId').notEmpty().withMessage('Cidade é obrigatória'),
  body('startDate').isISO8601().withMessage('A data de início deve ser uma data válida'),
  body('endDate').isISO8601().withMessage('A data de término deve ser uma data válida'),
  body('totalAmount').isNumeric().withMessage('O valor total deve ser um número'),
  body('maxApplicationValue').isNumeric().withMessage('O valor máximo por inscrição deve ser um número'),
  body('minApplicationValue').isNumeric().withMessage('O valor mínimo por inscrição deve ser um número')
];

// Rotas públicas
router.get('/', noticePreferenceMiddleware, noticeController.listNotices);
router.get('/:id', noticeController.getNoticeById);

// Rotas protegidas
router.post('/', authMiddleware, validateNotice, noticeController.create);
router.put('/:id', authMiddleware, validateNotice, noticeController.update);
router.delete('/:id', authMiddleware, noticeController.delete);

export default router; 