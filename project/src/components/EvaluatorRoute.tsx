import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Componente para proteger rotas que requerem acesso de parecerista (avaliador)
 */
interface EvaluatorRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

export const EvaluatorRoute: React.FC<EvaluatorRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const isEvaluator = user?.role === 'evaluator';
  const isAdmin = user?.role === 'admin';
  const hasAccess = isEvaluator || isAdmin; // Admins também podem acessar rotas de avaliador

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated || !hasAccess) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children || <Outlet />}</>;
};

export default EvaluatorRoute; 