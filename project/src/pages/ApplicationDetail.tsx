import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Download, 
  ChevronLeft, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageCircle,
  Edit,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

// Tipos simulados (serão substituídos pelos reais da API)
interface Application {
  id: string;
  noticeId: string;
  noticeTitle: string;
  projectTitle: string;
  projectDescription: string;
  entityName: string;
  submittedAt: Date;
  status: 'draft' | 'submitted' | 'under_evaluation' | 'approved' | 'rejected' | 'in_appeal';
  requestedAmount: number;
  category: string;
  formData: {
    [key: string]: any;
  };
  files: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  evaluations?: {
    id: string;
    evaluatorName: string;
    score: number;
    comment: string;
    date: Date;
  }[];
  appealDeadline?: Date;
}

export const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Função para formatar data
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-200 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_evaluation':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_appeal':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para traduzir o status
  const translateStatus = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'submitted':
        return 'Enviado';
      case 'under_evaluation':
        return 'Em Avaliação';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Reprovado';
      case 'in_appeal':
        return 'Em Recurso';
      default:
        return status;
    }
  };

  // Função para obter o ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText size={20} />;
      case 'submitted':
        return <CheckCircle size={20} />;
      case 'under_evaluation':
        return <Clock size={20} />;
      case 'approved':
        return <CheckCircle size={20} />;
      case 'rejected':
        return <XCircle size={20} />;
      case 'in_appeal':
        return <AlertCircle size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  // Efeito para carregar a inscrição
  useEffect(() => {
    // Simulação de chamada à API
    const fetchApplication = async () => {
      setLoading(true);
      try {
        // Em produção, substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados simulados
        const mockApplication: Application = {
          id: id || '1',
          noticeId: '1',
          noticeTitle: 'Edital de Apoio à Cultura 2024',
          projectTitle: 'Festival de Música Independente',
          projectDescription: 'O Festival de Música Independente tem como objetivo promover artistas locais e fomentar a cena musical independente da região. O evento contará com apresentações de 15 bandas e artistas solo durante 3 dias, além de oficinas de produção musical e palestras sobre o mercado da música.',
          entityName: 'Secretaria de Cultura do Estado',
          submittedAt: new Date('2024-03-15'),
          status: 'under_evaluation',
          requestedAmount: 45000,
          category: 'Música',
          formData: {
            targetAudience: 'Público jovem e adulto interessado em música independente, músicos e produtores culturais.',
            expectedResult: 'Realização de 15 shows com público estimado de 2.000 pessoas, 3 oficinas de produção musical com 60 participantes e 2 palestras sobre o mercado musical.',
            executionPeriod: 6,
            culturalArea: 'Música',
          },
          files: [
            {
              id: '1',
              name: 'Portfólio.pdf',
              url: '#',
              type: 'application/pdf'
            },
            {
              id: '2',
              name: 'Planilha Orçamentária.xlsx',
              url: '#',
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            {
              id: '3',
              name: 'Documentos Comprobatórios.zip',
              url: '#',
              type: 'application/zip'
            }
          ],
          evaluations: [
            {
              id: '1',
              evaluatorName: 'Maria Silva',
              score: 85,
              comment: 'Projeto bem estruturado com objetivos claros e viabilidade técnica. Orçamento adequado para as atividades propostas.',
              date: new Date('2024-03-20')
            }
          ],
          appealDeadline: new Date('2024-04-15')
        };

        setApplication(mockApplication);
      } catch (error) {
        console.error('Erro ao carregar inscrição:', error);
        toast.error('Erro ao carregar informações da inscrição.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // Função para lidar com a exclusão da inscrição (apenas para rascunhos)
  const handleDelete = async () => {
    if (!application || application.status !== 'draft') {
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este rascunho? Esta ação não pode ser desfeita.')) {
      try {
        // Em produção, substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success('Rascunho excluído com sucesso!');
        navigate('/applications');
      } catch (error) {
        console.error('Erro ao excluir rascunho:', error);
        toast.error('Erro ao excluir rascunho.');
      }
    }
  };

  // Função para lidar com o envio de recurso
  const handleAppeal = () => {
    if (!application || application.status !== 'rejected') {
      return;
    }

    navigate(`/applications/${id}/appeal`);
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

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscrição não encontrada</h2>
          <p className="text-gray-600 mb-6">A inscrição que você está procurando não existe ou foi removida.</p>
          <Link
            to="/applications"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Voltar para Inscrições
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navegação e ações */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <Link
          to="/applications"
          className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Voltar para Inscrições</span>
        </Link>

        {/* Ações */}
        {application.status === 'draft' && (
          <div className="flex space-x-3">
            <Link
              to={`/notices/${application.noticeId}/apply?draft=${application.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Edit size={18} />
              <span>Editar</span>
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-red-700 transition-colors"
            >
              <Trash2 size={18} />
              <span>Excluir</span>
            </button>
          </div>
        )}

        {application.status === 'rejected' && application.appealDeadline && new Date() < application.appealDeadline && (
          <button
            onClick={handleAppeal}
            className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-purple-700 transition-colors"
          >
            <MessageCircle size={18} />
            <span>Entrar com Recurso</span>
          </button>
        )}
      </div>

      {/* Cabeçalho */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
          <div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${getStatusColor(application.status)}`}>
              {getStatusIcon(application.status)}
              <span className="ml-2">{translateStatus(application.status)}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{application.projectTitle}</h1>
            <p className="text-gray-600">
              Edital: {application.noticeTitle} - {application.entityName}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-sm text-gray-500 mb-1">Valor solicitado:</div>
            <div className="text-xl font-bold text-gray-900">{formatCurrency(application.requestedAmount)}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar size={16} className="mr-2 text-gray-400" />
            <span>Enviado em: {formatDate(application.submittedAt)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FileText size={16} className="mr-2 text-gray-400" />
            <span>Categoria: {application.category}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhes do Projeto</h2>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição do Projeto</h3>
            <p className="text-gray-700">{application.projectDescription}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Público-alvo</h3>
              <p className="text-gray-700">{application.formData.targetAudience}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Área Cultural</h3>
              <p className="text-gray-700">{application.formData.culturalArea}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Período de Execução</h3>
              <p className="text-gray-700">{application.formData.executionPeriod} meses</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Resultados Esperados</h3>
              <p className="text-gray-700">{application.formData.expectedResult}</p>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">Documentos</h3>
          <div className="space-y-3 mb-6">
            {application.files.map((file) => (
              <a
                key={file.id}
                href={file.url}
                download
                className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FileText size={20} className="text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.type.split('/')[1].toUpperCase()}</p>
                </div>
                <Download size={18} className="text-gray-400" />
              </a>
            ))}
          </div>
          
          {/* Avaliações (se houver) */}
          {application.evaluations && application.evaluations.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Avaliações</h3>
              <div className="space-y-4">
                {application.evaluations.map((evaluation) => (
                  <div key={evaluation.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{evaluation.evaluatorName}</h4>
                        <p className="text-sm text-gray-500">{formatDate(evaluation.date)}</p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {evaluation.score}/100
                      </div>
                    </div>
                    <p className="text-gray-700">{evaluation.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Informações de recurso (se aplicável) */}
          {application.status === 'rejected' && application.appealDeadline && (
            <div className="mt-6 p-4 border border-yellow-200 bg-yellow-50 rounded-md">
              <div className="flex">
                <AlertCircle size={20} className="text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-yellow-800 font-medium mb-1">Informações sobre recurso</h3>
                  <p className="text-yellow-700 text-sm">
                    Você pode entrar com recurso até {formatDate(application.appealDeadline)}.
                    {new Date() < application.appealDeadline ? (
                      ' Clique no botão "Entrar com Recurso" acima para contestar o resultado.'
                    ) : (
                      ' O prazo para recurso expirou.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Rodapé */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {application.status === 'draft' ? (
                <span>Este é um rascunho e ainda não foi enviado.</span>
              ) : application.status === 'submitted' ? (
                <span>Sua inscrição foi enviada e está aguardando avaliação.</span>
              ) : application.status === 'under_evaluation' ? (
                <span>Sua inscrição está sendo avaliada.</span>
              ) : application.status === 'approved' ? (
                <span>Sua inscrição foi aprovada!</span>
              ) : application.status === 'rejected' ? (
                <span>Sua inscrição foi reprovada.</span>
              ) : application.status === 'in_appeal' ? (
                <span>Seu recurso está sendo analisado.</span>
              ) : null}
            </div>
            
            {application.status === 'approved' && (
              <Link
                to={`/applications/${application.id}/contract`}
                className="text-purple-600 text-sm font-medium flex items-center"
              >
                Ver Contrato
                <ArrowRight size={16} className="ml-1" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 