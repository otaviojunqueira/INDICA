import express from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import entityRoutes from './entity.routes';
import noticeRoutes from './notice.routes';
import applicationRoutes from './application.routes';
import evaluationRoutes from './evaluation.routes';

const router = express.Router();

// Definir rotas
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/entities', entityRoutes);
router.use('/notices', noticeRoutes);
router.use('/applications', applicationRoutes);
router.use('/evaluations', evaluationRoutes);

export default router; 