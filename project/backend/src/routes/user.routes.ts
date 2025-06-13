import express from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = express.Router();

// Validação para atualização de perfil
const validateProfileUpdate = [
  body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
  body('phone').optional().notEmpty().withMessage('Telefone não pode ser vazio'),
  body('password').optional().isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
];

// Validação para atualização de usuário por admin
const validateUserUpdate = [
  body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('phone').optional().notEmpty().withMessage('Telefone não pode ser vazio'),
  body('role').optional().isIn(['admin', 'agent', 'evaluator']).withMessage('Papel inválido'),
  body('isActive').optional().isBoolean().withMessage('Status ativo deve ser booleano')
];

// Rotas protegidas (requerem autenticação)
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, validateProfileUpdate, userController.updateProfile);

// Rotas de administrador
router.get('/', authenticate, isAdmin, userController.listAll);
router.get('/:id', authenticate, isAdmin, userController.getUser);
router.put('/:id', authenticate, isAdmin, validateUserUpdate, userController.updateUser);

export default router; 