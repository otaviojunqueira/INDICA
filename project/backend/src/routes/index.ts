import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import entityRoutes from './entity.routes';
import noticeRoutes from './notice.routes';
import applicationRoutes from './application.routes';
import evaluationRoutes from './evaluation.routes';
import agentProfileRoutes from './agentProfile.routes';
import culturalGroupRoutes from './culturalGroup.routes';
import culturalEventRoutes from './culturalEvent.routes';
import cityRoutes from './city.routes';
import evaluatorRoutes from './evaluator.routes';
import entityPortalRoutes from './entityPortal.routes';

const router = Router();

// Definir rotas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/entities', entityRoutes);
router.use('/notices', noticeRoutes);
router.use('/applications', applicationRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/agent-profiles', agentProfileRoutes);
router.use('/cultural-groups', culturalGroupRoutes);
router.use('/cultural-events', culturalEventRoutes);
router.use('/cities', cityRoutes);
router.use('/evaluators', evaluatorRoutes);
router.use('/entity-portal', entityPortalRoutes);

export default router; 