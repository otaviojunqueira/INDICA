import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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

// Middleware para verificar se o usuário está autenticado
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obter o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    // Extrair o token
    const token = authHeader.split(' ')[1];

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Adicionar o ID do usuário e o papel ao objeto de requisição
    (req as any).userId = decoded.id;
    (req as any).userRole = decoded.role;

    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

// Middleware para autorização baseada em papéis
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).userRole)) {
      return res.status(403).json({ 
        message: `Acesso negado. Apenas usuários com papel(is): ${roles.join(', ')} podem acessar este recurso.` 
      });
    }
    next();
  };
};

// Middleware para verificar se o usuário é um administrador
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).userRole !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
  next();
};

// Middleware para verificar se o usuário é um avaliador
export const isEvaluator = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).userRole !== 'evaluator' && (req as any).userRole !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas avaliadores podem acessar este recurso.' });
  }
  next();
};

// Middleware para verificar se o usuário é um agente cultural
export const isAgent = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).userRole !== 'agent' && (req as any).userRole !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas agentes culturais podem acessar este recurso.' });
  }
  next();
};

export default {
  authenticate,
  authorize,
  isAdmin,
  isEvaluator,
  isAgent
}; 