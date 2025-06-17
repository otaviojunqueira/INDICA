import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';

// Paleta de cores
const colors = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#ffffff',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
};

// Criar tema personalizado
export const theme = createTheme(
  {
    palette: {
      primary: colors.primary,
      secondary: colors.secondary,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      success: colors.success,
      background: colors.background,
    },
    typography: {
      fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          fullWidth: true
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 8
          }
        }
      }
    },
    shape: {
      borderRadius: 8
    }
  },
  ptBR // Adiciona localização em português
); 