import { BrowserRouter as Router } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { AppRoutes } from './routes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ptBR } from '@mui/material/locale';
import { Header } from './components/Layout/Header';
import { Toaster } from 'react-hot-toast';
import { Footer } from './components/Layout/Footer';

// Inicializar a configuração do axios
import './config/axios';

// Tema personalizado para o sistema INDICA
const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#FF7043',
        light: '#FF8A65',
        dark: '#E64A19',
      },
      background: {
        default: '#f5f5f5',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
          },
        },
      },
    },
  },
  ptBR // Adiciona localização em português
);

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