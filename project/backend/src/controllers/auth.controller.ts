import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models';
import { handleAsync } from '../utils/errorHandler';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Carrega as variáveis de ambiente
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'indica_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Função auxiliar para gerar token JWT
const generateToken = (user: any): string => {
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Controller para autenticação
export const authController = {
  // Registrar um novo usuário
  register: handleAsync(async (req: Request, res: Response) => {
    try {
      // Validar os dados da requisição
      console.log('Requisição de registro recebida:', req.body);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Erros de validação:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { cpfCnpj, name, email, password, phone, role, entityId, cityId } = req.body;
      console.log('Dados extraídos da requisição:', { cpfCnpj, name, email, phone, role, entityId, cityId });

      // Verificar se o usuário já existe
      const existingUser = await User.findOne({ $or: [{ email }, { cpfCnpj }] });
      if (existingUser) {
        console.log('Usuário já existe:', existingUser);
        if (existingUser.email === email) {
          return res.status(400).json({ message: 'Email já está em uso' });
        }
        return res.status(400).json({ message: 'CPF/CNPJ já está cadastrado' });
      }

      // Criar o novo usuário
      console.log('Criando novo usuário com dados:', { cpfCnpj, name, email, phone, role, entityId, cityId });
      
      // Limpar o CPF/CNPJ (remover pontos, traços e barras)
      const cleanCpfCnpj = cpfCnpj.replace(/[^\d]/g, '');
      console.log('CPF/CNPJ limpo:', cleanCpfCnpj);
      
      const user = new User({
        cpfCnpj: cpfCnpj, // Manter o formato original
        name,
        email,
        password,
        phone,
        role,
        entityId,
        cityId
      });

      await user.save();
      console.log('Usuário criado com sucesso:', user);

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
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error);
      if (error.name === 'ValidationError') {
        console.error('Erro de validação:', error.message);
        const errors = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({ message: 'Erro de validação', errors });
      }
      res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
  }),

  // Login de usuário
  login: handleAsync(async (req: Request, res: Response) => {
    const { cpfCnpj, password } = req.body;
    
    console.log('Tentativa de login com CPF/CNPJ:', cpfCnpj);
    
    try {
      // Buscar o usuário pelo CPF/CNPJ exato
      const user = await User.findOne({ cpfCnpj });
      
      if (!user) {
        console.log('Usuário não encontrado');
        return res.status(401).json({ message: 'CPF/CNPJ ou senha incorretos' });
      }
      
      console.log('Usuário encontrado:', user.email);
      
      // Verificar se o usuário está ativo
      if (!user.isActive) {
        console.log('Usuário desativado');
        return res.status(401).json({ message: 'Usuário está desativado. Entre em contato com o administrador.' });
      }
      
      // Verificar a senha usando bcrypt diretamente
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Senha correta:', isMatch ? 'Sim' : 'Não');
      
      if (!isMatch) {
        console.log('Senha incorreta');
        return res.status(401).json({ message: 'CPF/CNPJ ou senha incorretos' });
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      console.log('Login bem-sucedido para:', user.email);
      
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
    } catch (error) {
      console.error('Erro durante o login:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }),

  // Obter dados do usuário atual
  getCurrentUser: handleAsync(async (req: Request, res: Response) => {
    const userId = req.user._id;

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

    const userId = req.user._id;
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