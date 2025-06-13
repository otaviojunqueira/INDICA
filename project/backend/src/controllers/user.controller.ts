import { Request, Response } from 'express';
import User from '../models/User.model';
import { validationResult } from 'express-validator';

// Configuração do JWT
const JWT_SECRET = process.env.JWT_SECRET || 'indica_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Controller para usuários
export const userController = {
  // Obter dados do usuário atual
  getProfile: async (req: Request, res: Response) => {
    try {
      // O middleware de autenticação já adicionou o userId ao objeto req
      const userId = (req as any).userId;
      
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Atualizar dados do usuário
  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { name, phone, password } = req.body;

      // Buscar o usuário
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Atualizar os campos
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (password) user.password = password;

      await user.save();

      res.json({
        message: 'Perfil atualizado com sucesso',
        user: {
          id: user._id,
          cpfCnpj: user.cpfCnpj,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Listar todos os usuários (apenas para administradores)
  listAll: async (req: Request, res: Response) => {
    try {
      // Verificar se o usuário é administrador
      const userRole = (req as any).userRole;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Obter um usuário específico (apenas para administradores)
  getUser: async (req: Request, res: Response) => {
    try {
      // Verificar se o usuário é administrador
      const userRole = (req as any).userRole;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Atualizar um usuário (apenas para administradores)
  updateUser: async (req: Request, res: Response) => {
    try {
      // Verificar se o usuário é administrador
      const userRole = (req as any).userRole;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      const { name, email, phone, role, isActive } = req.body;

      // Buscar e atualizar o usuário
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Atualizar os campos
      if (name) user.name = name;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (role) user.role = role;
      if (isActive !== undefined) user.isActive = isActive;

      await user.save();

      res.json({
        message: 'Usuário atualizado com sucesso',
        user: {
          id: user._id,
          cpfCnpj: user.cpfCnpj,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }
};

export default userController;
