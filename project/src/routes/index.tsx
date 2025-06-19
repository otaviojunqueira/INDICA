import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Páginas públicas
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { NotFound } from '../pages/NotFound';

// Páginas protegidas - Dashboard e Perfil
import { Dashboard } from '../pages/Dashboard';
import { AgentProfilePage } from '../pages/AgentProfile';

// Páginas de coletivos culturais
import { CulturalGroupPage } from '../pages/CulturalGroup';

// Páginas de editais
import { NoticeList } from '../pages/Notice/List';
import { NoticeDetails } from '../pages/Notice/Details';

// Páginas de inscrições
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { ApplicationDetail } from '../pages/ApplicationDetail';
import { ApplicationForm } from '../pages/ApplicationForm';

// Páginas de administração
import { ReportsPage } from '../pages/ReportsPage';

// Componente de rota protegida
const PrivateRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />

      {/* Rotas Protegidas - Geral */}
      <Route path="/dashboard" element={<PrivateRouteWrapper><Dashboard /></PrivateRouteWrapper>} />
      
      {/* Rotas do Agente Cultural */}
      <Route path="/profile" element={<PrivateRouteWrapper><AgentProfilePage /></PrivateRouteWrapper>} />
      <Route path="/agent-profile" element={<PrivateRouteWrapper><AgentProfilePage /></PrivateRouteWrapper>} />
      <Route path="/cultural-group" element={<PrivateRouteWrapper><CulturalGroupPage /></PrivateRouteWrapper>} />
      <Route path="/cultural-group/:id" element={<PrivateRouteWrapper><CulturalGroupPage /></PrivateRouteWrapper>} />
      
      {/* Editais - Visualização para todos os usuários autenticados */}
      <Route path="/notices" element={<PrivateRouteWrapper><NoticeList /></PrivateRouteWrapper>} />
      <Route path="/notices/:id" element={<PrivateRouteWrapper><NoticeDetails /></PrivateRouteWrapper>} />
      
      {/* Inscrições de Editais */}
      <Route path="/applications" element={<PrivateRouteWrapper><ApplicationsPage /></PrivateRouteWrapper>} />
      <Route path="/applications/:id" element={<PrivateRouteWrapper><ApplicationDetail /></PrivateRouteWrapper>} />
      <Route path="/applications/new" element={<PrivateRouteWrapper><ApplicationForm /></PrivateRouteWrapper>} />
      <Route path="/applications/edit/:id" element={<PrivateRouteWrapper><ApplicationForm /></PrivateRouteWrapper>} />
      
      {/* Rotas de Administração */}
      <Route path="/admin/notices" element={<PrivateRouteWrapper><NoticeList /></PrivateRouteWrapper>} />
      <Route path="/admin/notices/create" element={<PrivateRouteWrapper><Dashboard /></PrivateRouteWrapper>} />
      <Route path="/admin/notices/edit/:id" element={<PrivateRouteWrapper><Dashboard /></PrivateRouteWrapper>} />
      <Route path="/admin/applications" element={<PrivateRouteWrapper><ApplicationsPage /></PrivateRouteWrapper>} />
      <Route path="/admin/reports" element={<PrivateRouteWrapper><ReportsPage /></PrivateRouteWrapper>} />
      <Route path="/admin/reports/:type" element={<PrivateRouteWrapper><ReportsPage /></PrivateRouteWrapper>} />
      
      {/* Rotas de Avaliador */}
      <Route path="/evaluator/projects" element={<PrivateRouteWrapper><Dashboard /></PrivateRouteWrapper>} />
      <Route path="/evaluator/projects/:id" element={<PrivateRouteWrapper><Dashboard /></PrivateRouteWrapper>} />
      <Route path="/evaluator/history" element={<PrivateRouteWrapper><Dashboard /></PrivateRouteWrapper>} />
      <Route path="/evaluator/appeals" element={<PrivateRouteWrapper><Dashboard /></PrivateRouteWrapper>} />
      
      {/* Documentação e Ajuda */}
      <Route path="/documentation" element={<PrivateRouteWrapper><About /></PrivateRouteWrapper>} />
      <Route path="/help" element={<PrivateRouteWrapper><About /></PrivateRouteWrapper>} />
      
      {/* Notificações */}
      <Route path="/notifications" element={<PrivateRouteWrapper><Dashboard /></PrivateRouteWrapper>} />

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}; 