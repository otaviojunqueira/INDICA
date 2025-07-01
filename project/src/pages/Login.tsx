import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import api from '../config/axios';

interface LoginForm {
  cpfCnpj: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      console.log('Iniciando login com:', {
        cpfCnpj: data.cpfCnpj,
        password: data.password.substring(0, 3) + '...'
      });
      
      // Remove qualquer token antigo
      localStorage.removeItem('auth_token');
      
      // Remove a formatação do CPF/CNPJ (deixa apenas os números)
      const cpfCnpjLimpo = data.cpfCnpj.replace(/\D/g, '');
      
      // Tenta fazer login com o CPF/CNPJ sem formatação
      await login(cpfCnpjLimpo, data.password);
      
      // Verifica se o token foi salvo corretamente
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('Login feito, mas o token não foi armazenado');
        toast.error('Erro de autenticação. Tente novamente.');
        return;
      }
      
      // Configura o token para o Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token configurado:', token.substring(0, 15) + '...');
      
      // Mensagem de sucesso
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro durante o login:', error);
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <img 
              src="/indica-logo-cut.png" 
              alt="INDICA" 
              className="h-24 mx-auto mb-4" 
            />
            <p className="text-gray-600 mt-2">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="cpfCnpj" className="block text-sm font-medium text-gray-700 mb-2">
                CPF ou CNPJ
              </label>
              <input
                {...register('cpfCnpj', { 
                  required: 'CPF ou CNPJ é obrigatório',
                  minLength: { value: 11, message: 'CPF/CNPJ deve ter pelo menos 11 dígitos' }
                })}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                onChange={(e) => {
                  e.target.value = formatCpfCnpj(e.target.value);
                }}
              />
              {errors.cpfCnpj && (
                <p className="text-red-500 text-sm mt-1">{errors.cpfCnpj.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  {...register('password', { 
                    required: 'Senha é obrigatória',
                    minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;