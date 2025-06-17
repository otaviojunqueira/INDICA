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
  body('startDate').isISO8601().withMessage('A data de início deve ser uma data válida'),
  body('endDate').isISO8601().withMessage('A data de término deve ser uma data válida'),
  body('totalAmount').isNumeric().withMessage('O valor total deve ser um número'),
  body('maxApplicationValue').isNumeric().withMessage('O valor máximo por inscrição deve ser um número'),
  body('minApplicationValue').isNumeric().withMessage('O valor mínimo por inscrição deve ser um número')
];

// Rotas públicas
router.get('/', noticePreferenceMiddleware, noticeController.listNotices);
router.get('/:id', noticeController.getNotice);

// Rotas protegidas
router.use(authMiddleware);

router.route('/')
  .post(validateNotice, noticeController.createNotice);

router.route('/:id')
  .put(validateNotice, noticeController.updateNotice);

router.post('/:id/publish', noticeController.publishNotice);
router.post('/:id/cancel', noticeController.cancelNotice);

export default router; 