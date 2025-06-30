import { Request, Response, NextFunction } from 'express';
import { Notice, User } from '../models';

/**
 * Middleware para priorizar editais da cidade do usuário
 * Este middleware ordena os resultados de uma consulta de editais,
 * priorizando aqueles da mesma cidade do usuário logado
 */
export const noticePreferenceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar se há um usuário autenticado e se a rota é de listagem de editais
    if (req.user && req.path === '/notices' && req.method === 'GET') {
      // Obter o ID da cidade do usuário
      const userId = req.user.id;
      const user = await User.findById(userId);
      
      if (user && user.cityId) {
        // Adicionar parâmetro de ordenação para priorizar editais da cidade do usuário
        req.query.priorityCityId = user.cityId.toString();
      }
    }
    
    next();
  } catch (error) {
    // Em caso de erro, apenas continuar sem aplicar a preferência
    next();
  }
};

/**
 * Função auxiliar para ordenar editais com base na cidade do usuário
 * Esta função é usada no controlador de editais para aplicar a ordenação
 */
export const sortNoticesByCityPreference = (notices: any[], userCityId: string | null) => {
  if (!userCityId) return notices;
  
  return [...notices].sort((a, b) => {
    // Priorizar editais da cidade do usuário
    if (a.cityId && a.cityId.toString() === userCityId) return -1;
    if (b.cityId && b.cityId.toString() === userCityId) return 1;
    
    // Manter a ordem original para editais de outras cidades
    return 0;
  });
};

export default noticePreferenceMiddleware; 