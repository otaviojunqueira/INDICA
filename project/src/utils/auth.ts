import axios from 'axios';

/**
 * Inicializa o token de autenticação a partir do localStorage
 * para ser usado em todas as requisições
 */
export const initializeAuth = () => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  }
  
  return false;
};

/**
 * Configura interceptors para tratar erros de autenticação
 * @param logoutCallback Função para fazer logout quando o token expirar
 */
export const setupAuthInterceptors = (logoutCallback: () => void) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Se o erro for 401 (não autorizado), fazer logout
      if (error.response && error.response.status === 401) {
        logoutCallback();
      }
      return Promise.reject(error);
    }
  );
};

export default { initializeAuth, setupAuthInterceptors }; 