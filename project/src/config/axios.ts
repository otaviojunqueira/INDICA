import axios from 'axios';

// Criar a instância do axios com a URL base da API
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Inicializar o token de autenticação
const token = localStorage.getItem('auth_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error.response?.status, error.response?.data);
    
    // Tratamento de erros de autenticação
    if (error.response && error.response.status === 401) {
      // Quando o token expirar ou for inválido, limpar o localStorage e redirecionar
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');

      // Se não estivermos na página de login, redirecionar para ela
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Interceptor para adicionar o token a todas as requisições
api.interceptors.request.use(
  (config) => {
    // Obter o token mais recente do localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
