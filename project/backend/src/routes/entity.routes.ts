import express from 'express';
import { body, param } from 'express-validator';
import * as entityController from '../controllers/entity.controller';
import authMiddleware, { authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Validação para criação/atualização de entidade
const entityValidation = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('type')
    .isIn(['municipal', 'state', 'federal'])
    .withMessage('Tipo deve ser municipal, state ou federal'),
  body('cnpj')
    .notEmpty()
    .withMessage('CNPJ é obrigatório')
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)
    .withMessage('CNPJ inválido (formato: XX.XXX.XXX/XXXX-XX)'),
  body('address').notEmpty().withMessage('Endereço é obrigatório'),
  body('contactEmail').isEmail().withMessage('Email de contato inválido'),
  body('contactPhone').notEmpty().withMessage('Telefone de contato é obrigatório'),
];

// Validação para ID da entidade
const entityIdValidation = [
  param('id').isUUID().withMessage('ID da entidade inválido'),
];

// Rotas públicas
router.get('/', entityController.getAllEntities);
router.get('/:id', entityIdValidation, entityController.getEntityById);

// Rotas protegidas (requer autenticação e autorização)
router.post(
  '/',
  authMiddleware,
  authorize(['admin']),
  entityValidation,
  entityController.createEntity
);

router.put(
  '/:id',
  authMiddleware,
  authorize(['admin']),
  entityIdValidation,
  entityValidation,
  entityController.updateEntity
);

router.delete(
  '/:id',
  authMiddleware,
  authorize(['admin']),
  entityIdValidation,
  entityController.deleteEntity
);

export default router; 