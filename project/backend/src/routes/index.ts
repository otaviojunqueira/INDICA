import { Router } from 'express';
import userRoutes from './user.routes';
import noticeRoutes from './notice.routes';
import culturalGroupRoutes from './culturalGroup.routes';
import authRoutes from './auth.routes';
import applicationRoutes from './application.routes';
import agentProfileRoutes from './agentProfile.routes';

const router = Router();

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de usuário
router.use('/users', userRoutes);

// Rotas de editais
router.use('/notices', noticeRoutes);

// Rotas de inscrições
router.use('/applications', applicationRoutes);

// Rotas de perfil do agente cultural
router.use('/agent-profile', agentProfileRoutes);

// Rotas de coletivos culturais
router.use('/cultural-groups', culturalGroupRoutes);

export default router; 