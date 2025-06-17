import { Router } from 'express';
import { culturalGroupController } from '../controllers/culturalGroup.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas básicas do coletivo
router.route('/')
  .post(culturalGroupController.createGroup)
  .get(culturalGroupController.listGroups);

router.route('/:id')
  .get(culturalGroupController.getGroup)
  .put(culturalGroupController.updateGroup);

// Rotas de gerenciamento de membros
router.route('/:id/members')
  .post(culturalGroupController.addMember);

router.route('/:id/members/:memberId')
  .delete(culturalGroupController.removeMember)
  .put(culturalGroupController.updateMemberRole);

// Rotas de gerenciamento de documentos
router.route('/:id/documents')
  .post(culturalGroupController.addDocument);

router.route('/:id/documents/:documentId')
  .delete(culturalGroupController.removeDocument);

export default router; 