import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Componente para proteger rotas que requerem acesso de administrador
 */
interface AdminRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children || <Outlet />}</>;
};

export default AdminRoute; 