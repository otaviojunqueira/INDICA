import { Request, Response, NextFunction } from 'express';

// Lista de emails permitidos para super admins
const SUPER_ADMIN_EMAILS = [
  'admin1@indica.com.br',
  'admin2@indica.com.br'
];

export const superAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    // Verifica se o usuário é um super admin
    if (user.role !== 'admin' || !SUPER_ADMIN_EMAILS.includes(user.email)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de super admin:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}; 