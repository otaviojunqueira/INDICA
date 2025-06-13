import { create } from 'zustand';
import axios from 'axios';
import { User } from '../types';
import API_ENDPOINTS from '../config/api';
import { setupAuthInterceptors } from '../utils/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cpfCnpj: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Configurar interceptors para tratar erros de autenticação
  setupAuthInterceptors(() => get().logout());

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (cpfCnpj: string, password: string) => {
      set({ isLoading: true });
      try {
        const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
          cpfCnpj,
          password
        });
        
        const { user, token } = response.data;
        
        // Salvar o token no localStorage
        localStorage.setItem('auth_token', token);
        
        // Configurar o token para todas as requisições futuras
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    logout: () => {
      // Remover o token do localStorage
      localStorage.removeItem('auth_token');
      
      // Remover o token das requisições futuras
      delete axios.defaults.headers.common['Authorization'];
      
      set({ user: null, isAuthenticated: false });
    },

    register: async (userData) => {
      set({ isLoading: true });
      try {
        const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        
        const { user, token } = response.data;
        
        // Salvar o token no localStorage
        localStorage.setItem('auth_token', token);
        
        // Configurar o token para todas as requisições futuras
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    // Verificar se o usuário está autenticado
    checkAuth: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return false;
      }

      try {
        set({ isLoading: true });
        const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE);
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        return true;
      } catch {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      }
    }
  };
});