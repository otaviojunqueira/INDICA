import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

const router = express.Router();

// Função para validar MongoDB ObjectId
const isValidObjectId = (value: string) => {
  return mongoose.Types.ObjectId.isValid(value);
};

// Validação para registro
const registerValidation = [
  body('cpfCnpj').notEmpty().withMessage('CPF/CNPJ é obrigatório'),
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('A senha deve ter pelo menos 6 caracteres'),
  body('phone').notEmpty().withMessage('Telefone é obrigatório'),
  body('role').optional().isIn(['admin', 'agent', 'evaluator']).withMessage('Perfil inválido'),
  body('entityId')
    .optional()
    .custom(isValidObjectId)
    .withMessage('ID da entidade inválido - deve ser um MongoDB ObjectId válido')
];

// Validação para login
const loginValidation = [
  body('cpfCnpj').notEmpty().withMessage('CPF/CNPJ é obrigatório'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
];

// Validação para atualização de senha
const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('A nova senha deve ter pelo menos 6 caracteres')
];

// Rotas públicas
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Rotas protegidas (requer autenticação)
router.get('/profile', authenticate, authController.getProfile);
router.put('/password', authenticate, updatePasswordValidation, authController.updatePassword);

export default router; 