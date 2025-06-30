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
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Token de autenticação não fornecido');
    }

    // Extrair o token
    const token = authHeader.split(' ')[1];

    // Verificar e decodificar o token
    let decoded: any;
    try {
      // @ts-ignore
      decoded = jwt.verify(token, JWT_SECRET);
      
      // Se o payload for uma string (devido ao JSON.stringify no controller)
      if (typeof decoded === 'string') {
        decoded = JSON.parse(decoded);
      }
    } catch (err) {
      throw new ApiError(401, 'Token inválido ou expirado');
    }

    // Verificar se o token é válido e obter o usuário
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new ApiError(401, 'Usuário não encontrado');
    }

    // Adicionar o usuário à requisição
    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Token inválido ou expirado'));
    }
    next(error);
  }
};

// Middleware para autorização baseada em papéis
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Acesso negado. Apenas usuários com papel(is): ${roles.join(', ')} podem acessar este recurso.` 
      });
    }
    next();
  };
};

// Middleware para verificar se o usuário é um administrador
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
  next();
};

// Middleware para verificar se o usuário é um avaliador
export const isEvaluator = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'evaluator' && req.user.role !== 'admin')) {
    return res.status(403).json({ message: 'Acesso negado. Apenas avaliadores podem acessar este recurso.' });
  }
  next();
};

// Middleware para verificar se o usuário é um agente cultural
export const isAgent = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'agent' && req.user.role !== 'admin')) {
    return res.status(403).json({ message: 'Acesso negado. Apenas agentes culturais podem acessar este recurso.' });
  }
  next();
};

export default authMiddleware; 