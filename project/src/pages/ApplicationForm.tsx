import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { ChevronLeft, Save, Upload, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

// Tipos simulados (serão substituídos pelos reais da API)
interface Notice {
  id: string;
  title: string;
  entityName: string;
  category: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'file';
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export const ApplicationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  // Efeito para carregar o edital
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para se inscrever.');
      navigate('/login');
      return;
    }

    // Simulação de chamada à API
    const fetchNotice = async () => {
      setLoading(true);
      try {
        // Em produção, substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados simulados
        const mockNotice: Notice = {
          id: id || '1',
          title: 'Edital de Apoio à Cultura 2024',
          entityName: 'Secretaria de Cultura do Estado',
          category: 'Música',
          fields: [
            {
              id: 'projectTitle',
              label: 'Título do Projeto',
              type: 'text',
              required: true,
            },
            {
              id: 'projectDescription',
              label: 'Descrição do Projeto',
              type: 'textarea',
              required: true,
            },
            {
              id: 'targetAudience',
              label: 'Público-alvo',
              type: 'text',
              required: true,
            },
            {
              id: 'expectedResult',
              label: 'Resultados Esperados',
              type: 'textarea',
              required: true,
            },
            {
              id: 'executionPeriod',
              label: 'Período de Execução (em meses)',
              type: 'number',
              required: true,
              validation: {
                min: 1,
                max: 24,
              },
            },
            {
              id: 'requestedAmount',
              label: 'Valor Solicitado (R$)',
              type: 'number',
              required: true,
              validation: {
                min: 1000,
                max: 100000,
              },
            },
            {
              id: 'culturalArea',
              label: 'Área Cultural',
              type: 'select',
              required: true,
              options: ['Música', 'Teatro', 'Dança', 'Artes Visuais', 'Literatura', 'Audiovisual', 'Patrimônio', 'Outros'],
            },
            {
              id: 'portfolio',
              label: 'Portfólio (PDF)',
              type: 'file',
              required: true,
            },
            {
              id: 'budget',
              label: 'Planilha Orçamentária (XLSX)',
              type: 'file',
              required: true,
            },
            {
              id: 'documents',
              label: 'Documentos Comprobatórios (ZIP)',
              type: 'file',
              required: true,
            },
          ],
        };

        setNotice(mockNotice);
      } catch (error) {
        console.error('Erro ao carregar edital:', error);
        toast.error('Erro ao carregar informações do edital.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, isAuthenticated, navigate]);

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      // Em produção, substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Dados enviados:', data);
      toast.success('Inscrição enviada com sucesso!');
      navigate('/applications');
    } catch (error) {
      console.error('Erro ao enviar inscrição:', error);
      toast.error('Erro ao enviar inscrição. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Função para renderizar os campos do formulário
  const renderFormField = (field: FormField) => {
    const fieldError = errors[field.id];
    
    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={field.id}
              type="text"
              {...register(field.id, { required: field.required ? `${field.label} é obrigatório` : false })}
              className={`w-full px-3 py-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {fieldError && <p className="mt-1 text-sm text-red-500">{fieldError.message?.toString()}</p>}
          </div>
        );
        
      case 'textarea':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={field.id}
              rows={5}
              {...register(field.id, { required: field.required ? `${field.label} é obrigatório` : false })}
              className={`w-full px-3 py-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {fieldError && <p className="mt-1 text-sm text-red-500">{fieldError.message?.toString()}</p>}
          </div>
        );
        
      case 'number':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={field.id}
              type="number"
              {...register(field.id, {
                required: field.required ? `${field.label} é obrigatório` : false,
                min: field.validation?.min !== undefined ? {
                  value: field.validation.min,
                  message: `O valor mínimo é ${field.validation.min}`
                } : undefined,
                max: field.validation?.max !== undefined ? {
                  value: field.validation.max,
                  message: `O valor máximo é ${field.validation.max}`
                } : undefined,
              })}
              className={`w-full px-3 py-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {fieldError && <p className="mt-1 text-sm text-red-500">{fieldError.message?.toString()}</p>}
            {field.validation?.min !== undefined && field.validation?.max !== undefined && (
              <p className="mt-1 text-xs text-gray-500">
                <Info size={12} className="inline mr-1" />
                Valor entre {field.validation.min} e {field.validation.max}
              </p>
            )}
          </div>
        );
        
      case 'date':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              id={field.id}
              type="date"
              {...register(field.id, { required: field.required ? `${field.label} é obrigatório` : false })}
              className={`w-full px-3 py-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {fieldError && <p className="mt-1 text-sm text-red-500">{fieldError.message?.toString()}</p>}
          </div>
        );
        
      case 'select':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              id={field.id}
              {...register(field.id, { required: field.required ? `${field.label} é obrigatório` : false })}
              className={`w-full px-3 py-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="">Selecione uma opção</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {fieldError && <p className="mt-1 text-sm text-red-500">{fieldError.message?.toString()}</p>}
          </div>
        );
        
      case 'file':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Controller
              name={field.id}
              control={control}
              rules={{ required: field.required ? `${field.label} é obrigatório` : false }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <div className="flex items-center">
                  <label
                    htmlFor={`file-${field.id}`}
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center"
                  >
                    <Upload size={18} className="mr-2" />
                    <span>Escolher arquivo</span>
                  </label>
                  <input
                    id={`file-${field.id}`}
                    type="file"
                    onChange={(e) => {
                      onChange(e.target.files?.[0]);
                    }}
                    onBlur={onBlur}
                    ref={ref}
                    className="hidden"
                  />
                  <span className="ml-3 text-sm text-gray-500">
                    {value ? value.name : 'Nenhum arquivo selecionado'}
                  </span>
                </div>
              )}
            />
            {fieldError && <p className="mt-1 text-sm text-red-500">{fieldError.message?.toString()}</p>}
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Edital não encontrado</h2>
          <p className="text-gray-600 mb-6">O edital que você está procurando não existe ou foi removido.</p>
          <Link
            to="/notices"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Voltar para Editais
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navegação */}
      <div className="mb-6">
        <Link
          to={`/notices/${id}`}
          className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Voltar para o Edital</span>
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inscrição no Edital</h1>
        <p className="text-gray-600">{notice.title} - {notice.entityName}</p>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex">
            <Info size={20} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-800 font-medium mb-1">Instruções para preenchimento</h3>
              <p className="text-blue-700 text-sm">
                Preencha todos os campos obrigatórios (marcados com *). Você pode salvar o formulário como rascunho e continuar depois. 
                Após o envio, não será possível editar as informações. Certifique-se de que todos os dados estão corretos antes de enviar.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campos do formulário */}
          {notice.fields.map(field => renderFormField(field))}

          {/* Declaração de veracidade */}
          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  {...register('terms', { required: 'Você precisa aceitar os termos para continuar' })}
                  className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Declaro que todas as informações fornecidas são verdadeiras e estou ciente das responsabilidades legais.
                </label>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-500">{errors.terms.message?.toString()}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={() => navigate(`/notices/${id}`)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-purple-300 rounded-md text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Salvar Rascunho
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  <span>Enviar Inscrição</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 