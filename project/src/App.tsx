import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { NoticesPage } from './pages/NoticesPage';
import { NoticeDetail } from './pages/NoticeDetail';
import { ApplicationForm } from './pages/ApplicationForm';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { ReportsPage } from './pages/ReportsPage';
import { useAuthStore } from './store/authStore';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, checkAuth } = useAuthStore();

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    
    verifyAuth();
  }, [checkAuth]);

  // Mostrar estado de carregamento enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
            />
            <Route 
              path="/forgot-password" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/notices/:id" element={<NoticeDetail />} />
            <Route 
              path="/notices/:id/apply" 
              element={isAuthenticated ? <ApplicationForm /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/applications" 
              element={isAuthenticated ? <ApplicationsPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/applications/:id" 
              element={isAuthenticated ? <ApplicationDetail /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports" 
              element={isAuthenticated ? <ReportsPage /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>

        <Footer />
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;