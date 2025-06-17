import { Request, Response, NextFunction } from 'express';
import { AgentProfile } from '../models';

export const noticePreferenceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verificar se é uma rota de listagem de editais
    if (req.baseUrl.includes('/notices') && req.method === 'GET') {
      const userId = req.user?.id;
      
      if (userId) {
        // Buscar perfil do agente para obter a cidade
        const profile = await AgentProfile.findOne({ userId });
        
        if (profile) {
          // Adicionar filtro de cidade à query
          req.query.city = profile.address.city;
          
          // Adicionar parâmetro para ordenar por relevância geográfica
          req.query.sortByLocation = 'true';
        }
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
}; 