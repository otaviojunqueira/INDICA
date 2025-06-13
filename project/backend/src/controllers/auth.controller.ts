import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Configuração do JWT
const JWT_SECRET = process.env.JWT_SECRET || 'indica_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Interface para o payload do token
interface TokenPayload {
  id: string;
  role: string;
}

/**
 * Gerar token JWT
 */
const generateToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: user._id ? user._id.toString() : '',
    role: user.role
  };
  
  // Ignorando verificações de tipo com `as any` para resolver o problema com jwt.sign
  return jwt.sign(payload, JWT_SECRET as any);
};

/**
 * Registrar um novo usuário
 */
export const register = async (req: Request, res: Response) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cpfCnpj, name, email, password, phone, role = 'agent', entityId } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({
      $or: [{ cpfCnpj }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Usuário já cadastrado com este CPF/CNPJ ou email.'
      });
    }

    // Criar o novo usuário
    const user = new User({
      cpfCnpj,
      name,
      email,
      password,
      phone,
      role,
      entityId: role === 'admin' ? entityId : undefined,
      isActive: true
    });

    await user.save();

    // Gerar token JWT usando a função auxiliar
    const token = generateToken(user);

    // Retornar dados do usuário (sem a senha) e o token
    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: user._id,
        cpfCnpj: user.cpfCnpj,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        entityId: user.entityId,
        isActive: user.isActive
      },
      token
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
};

/**
 * Login de usuário
 */
export const login = async (req: Request, res: Response) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cpfCnpj, password } = req.body;

    // Buscar usuário pelo CPF/CNPJ
    const user = await User.findOne({ cpfCnpj });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      return res.status(401).json({ message: 'Conta desativada. Entre em contato com o administrador.' });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Gerar token JWT
    const token = generateToken(user);

    // Retornar dados do usuário (sem a senha) e o token
    return res.status(200).json({
      message: 'Login realizado com sucesso',
      user: {
        id: user._id,
        cpfCnpj: user.cpfCnpj,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        entityId: user.entityId,
        isActive: user.isActive
      },
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};

/**
 * Obter perfil do usuário autenticado
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Buscar usuário pelo ID
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Retornar dados do usuário (sem a senha)
    return res.status(200).json({
      user: {
        id: user._id,
        cpfCnpj: user.cpfCnpj,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        entityId: user.entityId,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    return res.status(500).json({ message: 'Erro ao obter perfil do usuário.' });
  }
};

/**
 * Atualizar senha do usuário
 */
export const updatePassword = async (req: Request, res: Response) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    // Buscar usuário pelo ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar senha atual
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha atual incorreta.' });
    }

    // Atualizar senha
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Senha atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return res.status(500).json({ message: 'Erro ao atualizar senha.' });
  }
}; 