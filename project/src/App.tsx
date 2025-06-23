import { BrowserRouter as Router } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { AppRoutes } from './routes';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Layout/Header';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Layout/Footer';
import { theme } from './theme';

// Inicializar a configuração do axios
import './config/axios';

function App() {
  const { checkAuth } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verificar autenticação ao iniciar
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <Router>
      <div className="min-h-screen bg-white">
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        <main>
            <AppRoutes />
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
    </ThemeProvider>
  );
}

export default App;