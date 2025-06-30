import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Páginas públicas
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';

// Páginas protegidas - Dashboard e Perfil
import Dashboard from '../pages/Dashboard';
import AgentProfilePage from '../pages/AgentProfile';

// Páginas de coletivos culturais
import CulturalGroupPage from '../pages/CulturalGroup';

// Páginas de editais
import NoticeList from '../pages/Notice/List';
import NoticeDetails from '../pages/Notice/Details';

// Páginas de inscrições
import ApplicationsPage from '../pages/ApplicationsPage';
import ApplicationDetail from '../pages/ApplicationDetail';
import ApplicationForm from '../pages/ApplicationForm';

// Páginas de administração
import ReportsPage from '../pages/ReportsPage';

// Rotas de Admin
import CreateNoticePage from '../pages/admin/CreateNoticePage';
import DocumentsPage from '../pages/admin/DocumentsPage';

// Rotas de Parecerista
import EvaluationPage from '../pages/evaluator/EvaluationPage';
import EvaluationListPage from '../pages/evaluator/EvaluationListPage';
import ProjectsToEvaluatePage from '../pages/evaluator/ProjectsToEvaluatePage';
import HistoryPage from '../pages/evaluator/HistoryPage';
import ResourcesPage from '../pages/evaluator/ResourcesPage';

// Páginas de calendário cultural
import CalendarPage from '../pages/Calendar';

// Componentes de rota
import CulturalGroupRoute from '../components/CulturalGroupRoute';
import EvaluatorRoute from '../components/EvaluatorRoute';

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

import EvaluatorsManagementPage from '../pages/admin/EvaluatorsManagementPage';
import NewEvaluatorPage from '../pages/admin/NewEvaluatorPage';
import EditEvaluatorPage from '../pages/admin/EditEvaluatorPage';
import EntityPortalPage from '../pages/admin/EntityPortalPage';

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
      <Route path="/cultural-group" element={
        <PrivateRouteWrapper>
          <CulturalGroupRoute>
            <CulturalGroupPage />
          </CulturalGroupRoute>
        </PrivateRouteWrapper>
      } />
      <Route path="/cultural-group/:id" element={
        <PrivateRouteWrapper>
          <CulturalGroupRoute>
            <CulturalGroupPage />
          </CulturalGroupRoute>
        </PrivateRouteWrapper>
      } />
      
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
      <Route path="/evaluator/projects" element={
        <PrivateRouteWrapper>
          <EvaluatorRoute>
            <ProjectsToEvaluatePage />
          </EvaluatorRoute>
        </PrivateRouteWrapper>
      } />
      <Route path="/evaluator/history" element={
        <PrivateRouteWrapper>
          <EvaluatorRoute>
            <HistoryPage />
          </EvaluatorRoute>
        </PrivateRouteWrapper>
      } />
      <Route path="/evaluator/resources" element={
        <PrivateRouteWrapper>
          <EvaluatorRoute>
            <ResourcesPage />
          </EvaluatorRoute>
        </PrivateRouteWrapper>
      } />
      <Route path="/evaluator/evaluations" element={
        <PrivateRouteWrapper>
          <EvaluatorRoute>
            <EvaluationListPage />
          </EvaluatorRoute>
        </PrivateRouteWrapper>
      } />
      <Route path="/evaluator/evaluation/:id" element={
        <PrivateRouteWrapper>
          <EvaluatorRoute>
            <EvaluationPage />
          </EvaluatorRoute>
        </PrivateRouteWrapper>
      } />
      
      {/* Documentação e Ajuda */}
      <Route path="/documentation" element={<PrivateRouteWrapper><About /></PrivateRouteWrapper>} />
      <Route path="/help" element={<PrivateRouteWrapper><About /></PrivateRouteWrapper>} />
      
      {/* Notificações */}
      <Route path="/notifications" element={<PrivateRouteWrapper><Dashboard /></PrivateRouteWrapper>} />

      {/* Rotas de Admin */}
      <Route path="/admin/create-notice" element={<PrivateRouteWrapper><CreateNoticePage /></PrivateRouteWrapper>} />
      <Route path="/admin/documents" element={<PrivateRouteWrapper><DocumentsPage /></PrivateRouteWrapper>} />

      {/* Páginas de calendário cultural */}
      <Route path="/calendario" element={<CalendarPage />} />

      {/* Rotas de Admin */}
      <Route path="/admin/reports" element={<PrivateRouteWrapper><ReportsPage /></PrivateRouteWrapper>} />
      <Route path="/admin/documents" element={<PrivateRouteWrapper><DocumentsPage /></PrivateRouteWrapper>} />
      <Route path="/admin/notices/create" element={<PrivateRouteWrapper><CreateNoticePage /></PrivateRouteWrapper>} />
      
      {/* Rotas de Pareceristas */}
      <Route path="/admin/evaluators" element={<PrivateRouteWrapper><EvaluatorsManagementPage /></PrivateRouteWrapper>} />
      <Route path="/admin/evaluators/new" element={<PrivateRouteWrapper><NewEvaluatorPage /></PrivateRouteWrapper>} />
      <Route path="/admin/evaluators/edit/:id" element={<PrivateRouteWrapper><EditEvaluatorPage /></PrivateRouteWrapper>} />

      {/* Rotas de Portais de Entidades */}
      <Route path="/admin/entity-portals" element={<PrivateRouteWrapper><EntityPortalPage /></PrivateRouteWrapper>} />

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}; 