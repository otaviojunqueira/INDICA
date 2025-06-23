import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Componente para proteger rotas que requerem autenticação
 */
interface PrivateRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    // Exibir um componente de carregamento enquanto verifica a autenticação
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    // Redirecionar para a página de login se não estiver autenticado
    return <Navigate to={redirectTo} />;
  }

  // Renderiza o conteúdo protegido
  return <>{children || <Outlet />}</>;
};

export default PrivateRoute; 