import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Páginas públicas
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import NotFound from '../pages/NotFound';

// Páginas protegidas
import Dashboard from '../pages/Dashboard';
import ApplicationsPage from '../pages/ApplicationsPage';
import ApplicationForm from '../pages/ApplicationForm';
import ApplicationDetail from '../pages/ApplicationDetail';
import CulturalCalendar from '../pages/Calendar/CulturalCalendar';

// Páginas de admin
import EvaluatorsManagementPage from '../pages/admin/EvaluatorsManagementPage';
import NewEvaluatorPage from '../pages/admin/NewEvaluatorPage';
import EditEvaluatorPage from '../pages/admin/EditEvaluatorPage';
import EntityManagementPage from '../pages/admin/EntityManagementPage';
import ReportsPage from '../pages/admin/ReportsPage';
import DocumentsPage from '../pages/admin/DocumentsPage';
import EntityPortalPage from '../pages/admin/EntityPortalPage';
import CreateNoticePage from '../pages/admin/CreateNoticePage';

// Componentes
import PrivateRouteWrapper from '../components/PrivateRoute';
import AdminRoute from '../components/AdminRoute';

const AdminLayout: React.FC = () => {
  return (
    <AdminRoute>
      <Outlet />
    </AdminRoute>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Rotas Protegidas */}
      <Route path="/dashboard" element={<PrivateRouteWrapper><Dashboard /></PrivateRouteWrapper>} />
      <Route path="/applications" element={<PrivateRouteWrapper><ApplicationsPage /></PrivateRouteWrapper>} />
      <Route path="/applications/new" element={<PrivateRouteWrapper><ApplicationForm /></PrivateRouteWrapper>} />
      <Route path="/applications/:id" element={<PrivateRouteWrapper><ApplicationDetail /></PrivateRouteWrapper>} />
      <Route path="/calendar" element={<PrivateRouteWrapper><CulturalCalendar /></PrivateRouteWrapper>} />

      {/* Rotas de Admin */}
      <Route 
        path="/admin" 
        element={
          <PrivateRouteWrapper>
            <AdminLayout />
          </PrivateRouteWrapper>
        }
      >
        <Route path="evaluators" element={<EvaluatorsManagementPage />} />
        <Route path="evaluators/new" element={<NewEvaluatorPage />} />
        <Route path="evaluators/edit/:id" element={<EditEvaluatorPage />} />
        <Route path="entities" element={<EntityManagementPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="entity-portal" element={<EntityPortalPage />} />
        <Route path="create-notice" element={<CreateNoticePage />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}; 