import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ptBR } from '@mui/material/locale';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBrLocale from 'date-fns/locale/pt-BR';

// Contextos
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Páginas públicas
import HomePage from './pages/HomePage';
import NoticesPage from './pages/NoticesPage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Páginas de usuário comum (agente cultural)
import ProfilePage from './pages/user/ProfilePage';
import ApplicationFormPage from './pages/user/ApplicationFormPage';
import ApplicationsPage from './pages/user/ApplicationsPage';
import ApplicationDetailPage from './pages/user/ApplicationDetailPage';

// Páginas de administrador
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminNoticesPage from './pages/admin/NoticesPage';
import CreateNoticePage from './pages/admin/CreateNoticePage';
import EditNoticePage from './pages/admin/EditNoticePage';
import AdminApplicationsPage from './pages/admin/ApplicationsPage';
import AdminApplicationDetailPage from './pages/admin/ApplicationDetailPage';
import UsersPage from './pages/admin/UsersPage';
import EntitiesPage from './pages/admin/EntitiesPage';
import ReportsPage from './pages/admin/ReportsPage';

// Páginas de avaliador
import EvaluatorDashboardPage from './pages/evaluator/DashboardPage';
import EvaluationsPage from './pages/evaluator/EvaluationsPage';
import EvaluationPage from './pages/evaluator/EvaluationPage';

// Rotas protegidas
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import EvaluatorRoute from './components/EvaluatorRoute';

// Componentes
import NotFound from './components/NotFound';

// Tema personalizado
const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: '#f5f5f5',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  ptBR
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBrLocale}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Rotas públicas com layout de autenticação */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Rotas com layout principal */}
              <Route element={<MainLayout />}>
                {/* Rotas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/notices" element={<NoticesPage />} />
                <Route path="/notices/:id" element={<NoticeDetailPage />} />

                {/* Rotas de usuário (agente cultural) */}
                <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
                <Route path="/applications" element={<PrivateRoute element={<ApplicationsPage />} />} />
                <Route path="/applications/:id" element={<PrivateRoute element={<ApplicationDetailPage />} />} />
                <Route path="/notices/:id/apply" element={<PrivateRoute element={<ApplicationFormPage />} />} />

                {/* Rotas de administrador */}
                <Route path="/admin" element={<AdminRoute element={<AdminDashboardPage />} />} />
                <Route path="/admin/notices" element={<AdminRoute element={<AdminNoticesPage />} />} />
                <Route path="/admin/notices/create" element={<AdminRoute element={<CreateNoticePage />} />} />
                <Route path="/admin/notices/:id/edit" element={<AdminRoute element={<EditNoticePage />} />} />
                <Route path="/admin/applications" element={<AdminRoute element={<AdminApplicationsPage />} />} />
                <Route path="/admin/applications/:id" element={<AdminRoute element={<AdminApplicationDetailPage />} />} />
                <Route path="/admin/users" element={<AdminRoute element={<UsersPage />} />} />
                <Route path="/admin/entities" element={<AdminRoute element={<EntitiesPage />} />} />
                <Route path="/admin/reports" element={<AdminRoute element={<ReportsPage />} />} />

                {/* Rotas de avaliador */}
                <Route path="/evaluator" element={<EvaluatorRoute element={<EvaluatorDashboardPage />} />} />
                <Route path="/evaluator/evaluations" element={<EvaluatorRoute element={<EvaluationsPage />} />} />
                <Route path="/evaluator/evaluations/:id" element={<EvaluatorRoute element={<EvaluationPage />} />} />

                {/* Página não encontrada */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App; 