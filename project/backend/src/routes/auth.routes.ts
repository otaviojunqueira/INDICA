import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Validação para registro
const validateRegister = [
  body('cpfCnpj').notEmpty().withMessage('CPF/CNPJ é obrigatório'),
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('phone').notEmpty().withMessage('Telefone é obrigatório'),
  body('role').isIn(['admin', 'agent', 'evaluator']).withMessage('Papel inválido'),
  body('cityId').notEmpty().withMessage('Cidade é obrigatória')
];

// Validação para login
const validateLogin = [
  body('cpfCnpj').notEmpty().withMessage('CPF/CNPJ é obrigatório'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
];

// Validação para atualização de senha
const validateUpdatePassword = [
  body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter pelo menos 6 caracteres')
];

// Rotas públicas
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Rotas protegidas
router.get('/me', authMiddleware, authController.getCurrentUser);
router.put('/password', authMiddleware, validateUpdatePassword, authController.updatePassword);

export default router; 