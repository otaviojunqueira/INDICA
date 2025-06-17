import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Adicionar token de autenticação se existir
const token = localStorage.getItem('auth_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
