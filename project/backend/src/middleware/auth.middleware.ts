import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models';
import { ApiError } from '../utils/errorHandler';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'indica_secret_key';

// Interface para o payload do token JWT
interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

// Estendendo a interface Request para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: string;
      userRole?: string;
    }
  }
}

// Middleware de autenticação
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar se o token existe no cabeçalho
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ApiError(401, 'Token de autenticação não fornecido');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Formato de token inválido. Use: Bearer <token>');
    }

    // Extrair o token
    const token = authHeader.split(' ')[1];

    // Verificar e decodificar o token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      // Verificar se o token é válido e obter o usuário
      const user = await User.findById(decoded.id)
        .select('-password')
        .populate('entityId', 'name')
        .populate('cityId', 'name state stateCode');

      if (!user) {
        throw new ApiError(401, 'Token inválido - Usuário não encontrado');
      }

      if (!user.isActive) {
        throw new ApiError(401, 'Usuário está desativado. Entre em contato com o administrador.');
    }

    // Adicionar o usuário à requisição
    req.user = user;
      req.userId = user._id.toString();
    req.userRole = user.role;

    next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, 'Token expirado');
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, 'Token inválido');
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// Middleware para autorização baseada em papéis
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Não autorizado - Faça login primeiro' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Acesso negado. Apenas usuários com papel(is): ${roles.join(', ')} podem acessar este recurso.` 
      });
    }
    next();
  };
};

// Middleware para verificar se o usuário é um administrador
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autorizado - Faça login primeiro' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
  next();
};

// Middleware para verificar se o usuário é um avaliador
export const isEvaluator = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autorizado - Faça login primeiro' });
  }

  if (req.user.role !== 'evaluator' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas avaliadores podem acessar este recurso.' });
  }
  next();
};

// Middleware para verificar se o usuário é um agente cultural
export const isAgent = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autorizado - Faça login primeiro' });
  }

  if (req.user.role !== 'agent' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas agentes culturais podem acessar este recurso.' });
  }
  next();
};

export default authMiddleware; 