/// <reference types="@types/react-dom" />

// Declaração de módulo para react-dom/client
declare module 'react-dom/client' {
  export function createRoot(container: Element | null): {
    render(element: React.ReactNode): void;
  };
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeAuth, syncAuthTokens } from './utils/auth.ts';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

// Inicializar o token de autenticação
initializeAuth();
// Sincronizar tokens entre os sistemas de autenticação
syncAuthTokens();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <App />
    </LocalizationProvider>
  </StrictMode>
);
