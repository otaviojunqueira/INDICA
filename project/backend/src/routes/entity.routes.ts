import { Router } from 'express';
import { entityController } from '../controllers/entity.controller';
import authMiddleware, { isAdmin } from '../middleware/auth.middleware';

const router = Router();

// Rotas públicas
router.get('/public/state/:state', entityController.listByState);
router.get('/public/cnpj/:cnpj', entityController.findByCNPJ);

// Rotas protegidas
router.use(authMiddleware);

// Rotas que requerem autenticação
router.get('/', entityController.list);
router.get('/:id', entityController.getOne);

// Rotas que requerem privilégios de administrador
router.use(isAdmin);
router.post('/', entityController.create);
router.put('/:id', entityController.update);
router.patch('/:id/approve', entityController.approve);
router.patch('/:id/reject', entityController.reject);
router.patch('/:id/toggle-active', entityController.toggleActive);
router.patch('/:id/documents', entityController.updateDocuments);

export default router; 