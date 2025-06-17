import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'evaluator';
  entityId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEvaluator: boolean;
  isAgent: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  isAuthenticated: false,
  isAdmin: false,
  isEvaluator: false,
  isAgent: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verificar se o token ainda é válido buscando o perfil do usuário
          await authService.getProfile();
        } catch (err) {
          // Se houver erro, o token pode estar expirado
          logout();
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(email, password);
      
      const { token, user } = response;
      
      // Guardar token e usuário no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      const { token, user } = response;
      
      // Guardar token e usuário no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    // Remover token e usuário do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setToken(null);
    setUser(null);
  };

  // Limpar mensagens de erro
  const clearError = () => {
    setError(null);
  };

  // Valores computados
  const isAuthenticated = !!user && !!token;
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const isEvaluator = isAuthenticated && user?.role === 'evaluator';
  const isAgent = isAuthenticated && user?.role === 'agent';

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated,
    isAdmin,
    isEvaluator,
    isAgent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 