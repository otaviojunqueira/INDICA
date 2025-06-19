import { create } from 'zustand';
import axios from 'axios';
import { User } from '../types';
import API_ENDPOINTS from '../config/api';
import { setupAuthInterceptors } from '../utils/auth';
import { api } from '../config/axios';
import { USE_MOCK_DATA, authService } from '../mocks/mockServices';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cpfCnpj: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Função auxiliar para validar os dados do usuário
const isValidUser = (user: unknown): user is User => {
  if (!user || typeof user !== 'object') return false;
  
  const userObj = user as Record<string, unknown>;
  
  return typeof userObj.id === 'string' && 
    typeof userObj.name === 'string' && 
    typeof userObj.email === 'string' && 
    (userObj.role === 'admin' || userObj.role === 'agent' || userObj.role === 'evaluator');
};

export const useAuthStore = create<AuthState>((set, get) => {
  // Configurar interceptors para tratar erros de autenticação
  setupAuthInterceptors(() => get().logout());

  // Tentar carregar o usuário do localStorage na inicialização
  let initialUser: User | null = null;
  try {
    const storedUserData = localStorage.getItem('user_data');
    console.group('Carregamento de Usuário');
    console.log('Dados de usuário armazenados:', storedUserData);
    
    if (storedUserData) {
      const parsedUser = JSON.parse(storedUserData);
      console.log('Usuário parseado:', parsedUser);
      console.log('Tipo de usuário parseado:', typeof parsedUser);
      console.log('Chaves do usuário parseado:', Object.keys(parsedUser));
      
      if (isValidUser(parsedUser)) {
        initialUser = parsedUser;
        console.log('Usuário inicial válido:', initialUser);
      } else {
        console.error('Usuário inválido:', parsedUser);
        console.error('Detalhes da validação:', {
          id: typeof parsedUser.id,
          name: typeof parsedUser.name,
          email: typeof parsedUser.email,
          role: parsedUser.role
        });
      }
    }
    console.groupEnd();
  } catch (e) {
    console.error('Erro ao carregar dados iniciais do usuário:', e);
  }

  return {
    user: initialUser,
    isAuthenticated: !!initialUser,
    isLoading: false,

    login: async (cpfCnpj: string, password: string) => {
      set({ isLoading: true });
      try {
        let response: AuthResponse;
        if (USE_MOCK_DATA) {
          response = await authService.login(cpfCnpj, password);
        } else {
          const apiResponse = await axios.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
            cpfCnpj,
            password
          });
          response = apiResponse.data;
        }
        
        const { user, token } = response;
        
        if (!isValidUser(user)) {
          throw new Error('Dados do usuário inválidos recebidos do servidor');
        }

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        console.error('Erro no login:', error);
        set({ isLoading: false });
        throw error;
      }
    },

    logout: async () => {
      if (USE_MOCK_DATA) {
        await authService.logout();
      }
      
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      delete axios.defaults.headers.common['Authorization'];
      delete api.defaults.headers.common['Authorization'];
      
      set({ user: null, isAuthenticated: false });
    },

    register: async (userData) => {
      set({ isLoading: true });
      try {
        let response: AuthResponse;
        if (USE_MOCK_DATA) {
          response = await authService.register(userData as User);
        } else {
          const apiResponse = await axios.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
          response = apiResponse.data;
        }
        
        const { user, token } = response;
        
        if (!isValidUser(user)) {
          throw new Error('Dados do usuário inválidos recebidos do servidor');
        }

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    checkAuth: async () => {
      try {
        console.group('Verificação de Autenticação');
        console.log('Verificando autenticação...');
        
        if (USE_MOCK_DATA) {
          try {
            const user = await authService.checkAuth();
            console.log('Usuário mock:', user);
            
            if (!isValidUser(user)) {
              console.error('Dados do usuário mock inválidos:', user);
              throw new Error('Dados do usuário inválidos recebidos do mock');
            }
            
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          } catch (mockError) {
            console.error('Erro no serviço mock de autenticação:', mockError);
            set({ user: null, isAuthenticated: false, isLoading: false });
            return false;
          }
        }
        
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        console.log('Token encontrado:', !!token);
        console.log('Dados de usuário encontrados:', !!userData);
        
        if (!token || !userData) {
          console.warn('Token ou dados de usuário ausentes');
          set({ user: null, isAuthenticated: false });
          return false;
        }
        
        try {
          set({ isLoading: true });
          
          // Primeiro tenta carregar do localStorage
          const storedUser = JSON.parse(userData);
          console.log('Usuário armazenado:', storedUser);
          
          if (isValidUser(storedUser)) {
            console.log('Usuário do localStorage válido');
            set({ user: storedUser, isLoading: false, isAuthenticated: true });
          }
          
          // Configura o token e tenta obter o perfil atualizado
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await axios.get<AuthResponse>(API_ENDPOINTS.AUTH.PROFILE);
          const apiUser = response.data.user;
          
          console.log('Usuário da API:', apiUser);
          
          if (!isValidUser(apiUser)) {
            console.error('Dados do usuário da API inválidos:', apiUser);
            throw new Error('Dados do usuário inválidos recebidos da API');
          }

          set({ user: apiUser, isAuthenticated: true, isLoading: false });
          localStorage.setItem('user_data', JSON.stringify(apiUser));
          
          console.log('Autenticação bem-sucedida');
          console.groupEnd();
          return true;
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          
          // Se temos dados válidos no localStorage, usa como fallback
          try {
            const storedUser = JSON.parse(localStorage.getItem('user_data') || '');
            console.log('Tentando usar usuário do localStorage como fallback');
            
            if (isValidUser(storedUser)) {
              console.log('Usuário do localStorage usado como fallback');
              set({ user: storedUser, isAuthenticated: true, isLoading: false });
              console.groupEnd();
              return true;
            }
          } catch (e) {
            console.error('Não foi possível usar dados do localStorage como fallback:', e);
          }
          
          console.warn('Falha na autenticação');
          set({ user: null, isAuthenticated: false, isLoading: false });
          console.groupEnd();
          return false;
        }
      } catch (error) {
        console.error('Erro geral ao verificar autenticação:', error);
        set({ user: null, isAuthenticated: false, isLoading: false });
        console.groupEnd();
        return false;
      }
    }
  };
});