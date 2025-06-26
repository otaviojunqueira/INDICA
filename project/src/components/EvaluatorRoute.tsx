import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Componente que protege rotas específicas para pareceristas (avaliadores)
 * Verifica se o usuário está autenticado e se possui a role "evaluator"
 */
interface EvaluatorRouteProps {
  children: React.ReactNode;
}

const EvaluatorRoute: React.FC<EvaluatorRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Verificar se o usuário tem a role de avaliador
  if (user?.role !== 'evaluator') {
    // Redirecionar para o dashboard se não for um avaliador
    return <Navigate to="/dashboard" />;
  }

  // Se o usuário é um avaliador, renderizar o conteúdo da rota
  return <>{children}</>;
};

export default EvaluatorRoute; 