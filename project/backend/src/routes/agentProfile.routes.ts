import { Router } from 'express';
import { agentProfileController } from '../controllers/agentProfile.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas do perfil do agente
router.route('/')
  .post(agentProfileController.createOrUpdateProfile)
  .get(agentProfileController.getProfile)
  .delete(agentProfileController.deleteProfile);

// Rota para visualizar perfil público de outro agente
router.get('/public/:userId', agentProfileController.getPublicProfile);

export default router; 