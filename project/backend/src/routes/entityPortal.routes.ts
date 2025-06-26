import { Router } from 'express';
import { entityPortalController } from '../controllers/entityPortal.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// Rotas públicas
router.get('/entity/:entityId', entityPortalController.getPortalByEntityId);

// Rotas protegidas (apenas admin)
router.use(authMiddleware);

// Atualizar portal completo
router.put('/entity/:entityId', entityPortalController.updatePortal);

// Atualizar seção específica
router.put('/entity/:entityId/section/:section', entityPortalController.updatePortalSection);

// Adicionar item a uma seção
router.post('/entity/:entityId/section/:section', entityPortalController.addItemToSection);

// Remover item de uma seção
router.delete('/entity/:entityId/section/:section/item/:itemId', entityPortalController.removeItemFromSection);

export default router;
