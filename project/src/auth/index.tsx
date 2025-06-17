import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { api } from '../config/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextData {
  signed: boolean;
  loading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    };

    loadStorageData();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;

      if (!token || !user) {
        throw new Error('Token ou usuário não encontrado');
      }

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(user);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    api.defaults.headers.common.Authorization = '';
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loading,
        user,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
