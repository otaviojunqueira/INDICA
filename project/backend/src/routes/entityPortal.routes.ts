import { Router } from 'express';
import { entityPortalController } from '../controllers/entityPortal.controller';
import authMiddleware, { isAdmin } from '../middleware/auth.middleware';
import { check } from 'express-validator';

const router = Router();

// Validação para criação e atualização de portais de entidades
const entityPortalValidation = [
  check('entityId').optional().isUUID().withMessage('ID de entidade inválido'),
  check('title').notEmpty().withMessage('Título é obrigatório'),
  check('description').notEmpty().withMessage('Descrição é obrigatória'),
  check('contactEmail')
    .notEmpty().withMessage('Email de contato é obrigatório')
    .isEmail().withMessage('Email de contato inválido'),
  check('logoUrl').optional().isURL().withMessage('URL do logo inválida'),
  check('bannerUrl').optional().isURL().withMessage('URL do banner inválida'),
  check('primaryColor').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Cor primária deve ser um código hexadecimal válido'),
  check('secondaryColor').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Cor secundária deve ser um código hexadecimal válido')
];

// Validação para atualização de status
const statusValidation = [
  check('isActive').isBoolean().withMessage('O campo isActive deve ser um booleano')
];

// Rotas públicas
router.get('/', entityPortalController.listEntityPortals);
router.get('/:id', entityPortalController.getEntityPortalById);
router.get('/entity/:entityId', entityPortalController.getEntityPortalByEntityId);

// Rotas protegidas (apenas para administradores)
router.post('/', authMiddleware, isAdmin, entityPortalValidation, entityPortalController.createEntityPortal);
router.put('/:id', authMiddleware, isAdmin, entityPortalValidation, entityPortalController.updateEntityPortal);
router.patch('/:id/status', authMiddleware, isAdmin, statusValidation, entityPortalController.updateEntityPortalStatus);
router.delete('/:id', authMiddleware, isAdmin, entityPortalController.deleteEntityPortal);

export default router;
