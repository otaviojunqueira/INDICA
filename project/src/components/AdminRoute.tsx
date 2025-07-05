import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Lista de emails permitidos para super admins
const SUPER_ADMIN_EMAILS = [
  'admin1@indica.com.br',
  'admin2@indica.com.br'
];

/**
 * Componente para proteger rotas que requerem acesso de administrador
 */
interface AdminRouteProps {
  children?: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  // Se o usuário não estiver autenticado, redirecionar para o login
  if (!isAuthenticated || !user) {
    console.log('AdminRoute: Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Verificar se o usuário é um super admin
  const isSuperAdmin = user.role === 'admin' && SUPER_ADMIN_EMAILS.includes(user.email);

  // Se não for um super admin, redirecionar para o dashboard
  if (!isSuperAdmin) {
    console.log('AdminRoute: Usuário não é super admin, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Se for um super admin, permitir acesso à rota de administração
  console.log('AdminRoute: Acesso permitido para super admin');
  return <>{children || <Outlet />}</>;
};

export default AdminRoute; 