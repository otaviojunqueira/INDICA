import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/culturalEvent.controller';

const router = Router();

// Rotas públicas
router.get('/', getEvents);
router.get('/:id', getEventById);

// Rotas protegidas (apenas para Entes Federados)
router.post('/', authMiddleware, createEvent);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);

export default router; 