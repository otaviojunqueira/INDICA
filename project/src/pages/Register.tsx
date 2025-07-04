import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, User, Building } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import Card from '../components/UI/Card';
import cityService from '../services/city.service';

interface RegisterForm {
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'agent' | 'admin';
  terms: boolean;
  cityId: string;
  
  birthDate?: string;
  address?: string;
  
  responsiblePerson?: string;
  position?: string;
  institutionalPhone?: string;
}

interface State {
  sigla: string;
  nome: string;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [cityName, setCityName] = useState('');
  const [isCreatingCity, setIsCreatingCity] = useState(false);
  
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterForm>();
  const watchRole = watch('role', 'agent');
  const watchPassword = watch('password');

  useEffect(() => {
    const estadosBrasileiros = [
      { sigla: 'AC', nome: 'Acre' },
      { sigla: 'AL', nome: 'Alagoas' },
      { sigla: 'AP', nome: 'Amapá' },
      { sigla: 'AM', nome: 'Amazonas' },
      { sigla: 'BA', nome: 'Bahia' },
      { sigla: 'CE', nome: 'Ceará' },
      { sigla: 'DF', nome: 'Distrito Federal' },
      { sigla: 'ES', nome: 'Espírito Santo' },
      { sigla: 'GO', nome: 'Goiás' },
      { sigla: 'MA', nome: 'Maranhão' },
      { sigla: 'MT', nome: 'Mato Grosso' },
      { sigla: 'MS', nome: 'Mato Grosso do Sul' },
      { sigla: 'MG', nome: 'Minas Gerais' },
      { sigla: 'PA', nome: 'Pará' },
      { sigla: 'PB', nome: 'Paraíba' },
      { sigla: 'PR', nome: 'Paraná' },
      { sigla: 'PE', nome: 'Pernambuco' },
      { sigla: 'PI', nome: 'Piauí' },
      { sigla: 'RJ', nome: 'Rio de Janeiro' },
      { sigla: 'RN', nome: 'Rio Grande do Norte' },
      { sigla: 'RS', nome: 'Rio Grande do Sul' },
      { sigla: 'RO', nome: 'Rondônia' },
      { sigla: 'RR', nome: 'Roraima' },
      { sigla: 'SC', nome: 'Santa Catarina' },
      { sigla: 'SP', nome: 'São Paulo' },
      { sigla: 'SE', nome: 'Sergipe' },
      { sigla: 'TO', nome: 'Tocantins' }
    ];
    setStates(estadosBrasileiros);
  }, []);

  const onSubmit = async (data: RegisterForm) => {
    // Validar senhas
    if (data.password !== data.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    try {
      console.log('Iniciando processo de cadastro', { data, cityName, selectedState });
      
      // Processar cidade apenas se o estado e nome da cidade estiverem preenchidos
      if (cityName && selectedState) {
        setIsCreatingCity(true);
        try {
          // Buscar ou criar a cidade
          console.log('Buscando/criando cidade com nome:', cityName, 'e estado:', selectedState);
          const cityResponse = await cityService.findOrCreateCity({
            name: cityName,
            state: selectedState
          });
          
          console.log('Resposta da cidade:', cityResponse);
          
          // Atualizar o ID da cidade no formulário
          const cityId = cityResponse._id || cityResponse.id;
          console.log('ID da cidade definido:', cityId);
          data.cityId = cityId;
          setValue('cityId', cityId);
        } catch (error) {
          console.error('Erro ao criar/buscar cidade:', error);
          toast.error('Erro ao processar a cidade. Tente novamente.');
          setIsCreatingCity(false);
          return;
        }
        setIsCreatingCity(false);
      } else {
        console.log('Cidade ou estado não selecionados:', { cityName, selectedState });
        toast.error('Por favor, selecione um estado e digite o nome da cidade');
        return;
      }

      // Preparar dados para envio
      const submitData = {
        ...data,
        role: data.role,
        ...(data.role === 'agent' ? {
          responsiblePerson: undefined,
          position: undefined,
          institutionalPhone: undefined
        } : {
          birthDate: undefined,
          address: undefined
        })
      };

      console.log('Enviando dados para registro:', submitData);
      await registerUser(submitData);
      console.log('Cadastro realizado com sucesso');
      toast.success('Cadastro realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao realizar cadastro:', error);
      toast.error('Erro ao realizar cadastro. Tente novamente.');
    }
  };

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    // Formatar como CPF (11 dígitos)
    if (numbers.length <= 11) {
      if (numbers.length < 3) return numbers;
      if (numbers.length < 6) return numbers.replace(/^(\d{3})/, '$1.');
      if (numbers.length < 9) return numbers.replace(/^(\d{3})(\d{3})/, '$1.$2.');
      return numbers.replace(/^(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-').slice(0, 14);
    } 
    // Formatar como CNPJ (14 dígitos)
    else {
      if (numbers.length < 3) return numbers;
      if (numbers.length < 6) return numbers.replace(/^(\d{2})/, '$1.');
      if (numbers.length < 9) return numbers.replace(/^(\d{2})(\d{3})/, '$1.$2.');
      if (numbers.length < 13) return numbers.replace(/^(\d{2})(\d{3})(\d{3})/, '$1.$2.$3/');
      return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4-').slice(0, 18);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Cadastrar no INDICA</h2>
            <p className="text-gray-600 mt-2">Crie sua conta e comece a usar a plataforma</p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault(); // Prevenir o comportamento padrão
              console.log('Formulário submetido via evento de formulário - isso não deveria acontecer');
            }} 
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Usuário
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  watchRole === 'agent' ? 'border-purple-600 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    {...register('role', { required: 'Selecione o tipo de usuário' })}
                    type="radio"
                    value="agent"
                    className="sr-only"
                  />
                  <User className="w-6 h-6 text-purple-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Agente Cultural</div>
                    <div className="text-sm text-gray-600">Artista, produtor ou coletivo cultural</div>
                  </div>
                </label>
                
                <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  watchRole === 'admin' ? 'border-purple-600 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    {...register('role', { required: 'Selecione o tipo de usuário' })}
                    type="radio"
                    value="admin"
                    className="sr-only"
                  />
                  <Building className="w-6 h-6 text-purple-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Gestor Público</div>
                    <div className="text-sm text-gray-600">Representante de ente federativo</div>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {watchRole === 'agent' ? 'Nome Completo' : 'Nome do Órgão'}
                </label>
                <input
                  {...register('name', { 
                    required: `${watchRole === 'agent' ? 'Nome' : 'Nome do Órgão'} é obrigatório`,
                    minLength: { value: 2, message: `${watchRole === 'agent' ? 'Nome' : 'Nome do Órgão'} deve ter pelo menos 2 caracteres` }
                  })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder={watchRole === 'agent' ? 'Seu nome completo' : 'Nome do órgão'}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="cpfCnpj" className="block text-sm font-medium text-gray-700 mb-2">
                  {watchRole === 'agent' ? 'CPF' : 'CNPJ'}
                </label>
                <input
                  {...register('cpfCnpj', { 
                    required: `${watchRole === 'agent' ? 'CPF' : 'CNPJ'} é obrigatório`,
                    minLength: { value: 11, message: `${watchRole === 'agent' ? 'CPF' : 'CNPJ'} inválido` }
                  })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder={watchRole === 'agent' ? '000.000.000-00' : '00.000.000/0000-00'}
                  onChange={(e) => {
                    e.target.value = formatCpfCnpj(e.target.value);
                  }}
                />
                {errors.cpfCnpj && (
                  <p className="text-red-500 text-sm mt-1">{errors.cpfCnpj.message}</p>
                )}
              </div>
            </div>

            {watchRole === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="responsiblePerson" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Responsável
                  </label>
                  <input
                    {...register('responsiblePerson', { 
                      required: 'Nome do responsável é obrigatório'
                    })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Nome do responsável"
                  />
                  {errors.responsiblePerson && (
                    <p className="text-red-500 text-sm mt-1">{errors.responsiblePerson.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo
                  </label>
                  <input
                    {...register('position', { 
                      required: 'Cargo é obrigatório'
                    })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Cargo do responsável"
                  />
                  {errors.position && (
                    <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="institutionalPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone Institucional
                  </label>
                  <input
                    {...register('institutionalPhone', { 
                      required: 'Telefone institucional é obrigatório'
                    })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="(00) 00000-0000"
                    onChange={(e) => {
                      e.target.value = formatPhone(e.target.value);
                    }}
                  />
                  {errors.institutionalPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.institutionalPhone.message}</p>
                  )}
                </div>
              </div>
            )}

            {watchRole === 'agent' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    {...register('birthDate', { 
                      required: 'Data de nascimento é obrigatória'
                    })}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                  {errors.birthDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input
                    {...register('address', { 
                      required: 'Endereço é obrigatório'
                    })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Seu endereço completo"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  {...register('email', { 
                    required: 'E-mail é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'E-mail inválido'
                    }
                  })}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  {...register('phone', { 
                    required: 'Telefone é obrigatório',
                    minLength: { value: 10, message: 'Telefone inválido' }
                  })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="(00) 00000-0000"
                  onChange={(e) => {
                    e.target.value = formatPhone(e.target.value);
                  }}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword', { 
                      required: 'Confirmação de senha é obrigatória',
                      validate: value => value === watchPassword || 'As senhas não coincidem'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-start">
                <input
                  {...register('terms', { required: 'Você deve aceitar os termos de uso' })}
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Eu aceito os{' '}
                  <Link to="/terms" className="text-purple-600 hover:text-purple-700">
                    Termos de Uso
                  </Link>{' '}
                  e a{' '}
                  <Link to="/privacy" className="text-purple-600 hover:text-purple-700">
                    Política de Privacidade
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  onChange={(e) => setSelectedState(e.target.value)}
                  value={selectedState}
                  required
                >
                  <option value="">Selecione um estado</option>
                  {states.map((state) => (
                    <option key={state.sigla} value={state.sigla}>
                      {state.nome}
                    </option>
                  ))}
                </select>
                {!selectedState && (
                  <p className="text-red-500 text-sm mt-1">Estado é obrigatório</p>
                )}
              </div>

              <div>
                <label htmlFor="cityName" className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Digite o nome da sua cidade"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  disabled={!selectedState || isCreatingCity}
                  required
                />
                {!cityName && selectedState && (
                  <p className="text-red-500 text-sm mt-1">Cidade é obrigatória</p>
                )}
                <input
                  type="hidden"
                  {...register('cityId', { required: 'Cidade é obrigatória' })}
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                disabled={isLoading}
                onClick={async () => {
                  console.log('Botão de cadastro clicado');
                  if (selectedState && cityName) {
                    try {
                      // Buscar ou criar a cidade primeiro
                      const cityResponse = await cityService.findOrCreateCity({
                        name: cityName,
                        state: selectedState
                      });
                      
                      // Atualizar o ID da cidade no formulário
                      const cityId = cityResponse._id || cityResponse.id;
                      setValue('cityId', cityId);
                      
                      // Submeter o formulário
                      handleSubmit(onSubmit)();
                    } catch (error) {
                      console.error('Erro ao processar cadastro:', error);
                      toast.error('Erro ao processar cadastro. Tente novamente.');
                    }
                  } else {
                    toast.error('Por favor, selecione um estado e digite o nome da cidade');
                  }
                }}
              >
                {isLoading ? 'Processando...' : 'Cadastrar'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-500">
                Faça login
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;