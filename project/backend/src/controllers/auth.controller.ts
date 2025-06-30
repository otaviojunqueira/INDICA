import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models';
import { handleAsync } from '../utils/errorHandler';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'indica_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Função auxiliar para gerar token JWT
const generateToken = (user: any): string => {
  // Payload como objeto, não como string
  const payload = { id: user._id, role: user.role };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Controller para autenticação
export const authController = {
  // Registrar um novo usuário
  register: handleAsync(async (req: Request, res: Response) => {
    // Validar os dados da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cpfCnpj, name, email, password, phone, role = 'agent', entityId, cityId } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ $or: [{ email }, { cpfCnpj }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe com este email ou CPF/CNPJ' });
    }

    // Criar o novo usuário
    const user = new User({
      cpfCnpj,
      name,
      email,
      password,
      phone,
      role,
      entityId,
      cityId
    });

    await user.save();

    // Gerar token JWT
    const token = generateToken(user);

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        entityId: user.entityId,
        cityId: user.cityId
      }
    });
  }),

  // Login de usuário
  login: handleAsync(async (req: Request, res: Response) => {
    const { cpfCnpj, password } = req.body;

    // Encontrar o usuário
    const user = await User.findOne({ cpfCnpj });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      return res.status(401).json({ message: 'Usuário desativado' });
    }

    // Verificar a senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = generateToken(user);

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        entityId: user.entityId,
        cityId: user.cityId
      }
    });
  }),

  // Obter dados do usuário atual
  getCurrentUser: handleAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select('-password')
      .populate('entityId', 'name')
      .populate('cityId', 'name state stateCode');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        entityId: user.entityId,
        cityId: user.cityId,
        entity: user.entityId,
        city: user.cityId
      }
    });
  }),

  // Atualizar senha do usuário
  updatePassword: handleAsync(async (req: Request, res: Response) => {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Buscar usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar senha atual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }

    // Atualizar senha
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Senha atualizada com sucesso' });
  })
}; 