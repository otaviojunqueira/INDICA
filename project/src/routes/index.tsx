import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

// Páginas públicas
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { NotFound } from '../pages/NotFound';

// Páginas protegidas
import { Dashboard } from '../pages/Dashboard';
import { AgentProfilePage } from '../pages/AgentProfile';
import { CulturalGroupPage } from '../pages/CulturalGroup';
import { NoticeList } from '../pages/Notice/List';
import { NoticeDetails } from '../pages/Notice/Details';

// Componente de rota protegida
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!signed) {
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

      {/* Rotas Protegidas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <AgentProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/cultural-group"
        element={
          <PrivateRoute>
            <CulturalGroupPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/notices"
        element={
          <PrivateRoute>
            <NoticeList />
          </PrivateRoute>
        }
      />
      <Route
        path="/notices/:id"
        element={
          <PrivateRoute>
            <NoticeDetails />
          </PrivateRoute>
        }
      />

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}; 