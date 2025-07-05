import { Router } from 'express';
import { entityController } from '../controllers/entity.controller';
import authMiddleware from '../middleware/auth.middleware';
import { superAdminMiddleware } from '../middleware/superAdmin.middleware';

const router = Router();

// Rotas protegidas por autenticação e super admin
router.use(authMiddleware);
router.use(superAdminMiddleware);

// Rotas de gerenciamento de entidades
router.get('/', entityController.getAllEntities);
router.get('/search', entityController.searchEntities);
router.get('/:id', entityController.getEntity);
router.put('/:id', entityController.updateEntity);
router.patch('/:id/status', entityController.toggleEntityStatus);

export default router; 