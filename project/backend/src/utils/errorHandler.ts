import { Request, Response, NextFunction } from 'express';

// Handler para funções assíncronas em controllers
export const handleAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Class para erros da API
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Middleware de tratamento de erros
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro:', err);
  
  // Se for um erro da API, usa o código e mensagem definidos
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }
  
  // Caso contrário, erro interno do servidor
  return res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
};

// Middleware para rotas não encontradas
export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: `Rota ${req.originalUrl} não encontrada`
  });
}; 