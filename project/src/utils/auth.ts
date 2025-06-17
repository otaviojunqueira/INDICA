import axios from 'axios';

// Chave para armazenar o token no localStorage
const TOKEN_KEY = 'auth_token';

// Armazenar o token JWT
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Obter o token JWT
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remover o token JWT
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

// Inicializar o token de autenticação
export const initializeAuth = (): void => {
  const token = getAuthToken();
  if (token) {
    // Se houver um token no localStorage, configura o cabeçalho de autorização
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Configurar interceptors para tratar erros de autenticação
export const setupAuthInterceptors = (logoutCallback: () => void): void => {
  axios.interceptors.response.use(
    response => response,
    error => {
      // Se receber um erro 401 (não autorizado), efetua logout
      if (error.response && error.response.status === 401) {
        logoutCallback();
      }
      return Promise.reject(error);
    }
  );
};

// Sincronizar os tokens entre os diferentes sistemas de autenticação
export const syncAuthTokens = (): void => {
  const authToken = localStorage.getItem('auth_token');
  
  if (authToken) {
    // Garantir que o token esteja configurado no cabeçalho de todas as requisições
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  }
}; 