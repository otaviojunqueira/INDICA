import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  FileText, 
  Clock, 
  Tag, 
  Download, 
  ChevronLeft,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

// Tipos simulados (serão substituídos pelos reais da API)
interface Notice {
  id: string;
  title: string;
  description: string;
  entityName: string;
  category: string;
  budget: number;
  openingDate: Date;
  closingDate: Date;
  evaluationDate: Date;
  resultDate: Date;
  status: 'draft' | 'open' | 'evaluation' | 'result' | 'closed';
  requirements: string[];
  documents: string[];
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export const NoticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
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
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'evaluation':
        return 'bg-yellow-100 text-yellow-800';
      case 'result':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para traduzir o status
  const translateStatus = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'open':
        return 'Aberto';
      case 'evaluation':
        return 'Em Avaliação';
      case 'result':
        return 'Resultado';
      case 'closed':
        return 'Encerrado';
      default:
        return status;
    }
  };

  // Efeito para carregar o edital
  useEffect(() => {
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
          description: 'O Edital de Apoio à Cultura 2024 tem como objetivo fomentar projetos culturais nas áreas de música, teatro e dança. Os projetos selecionados receberão apoio financeiro para sua realização, contribuindo para o desenvolvimento cultural da região. Este edital é uma iniciativa da Secretaria de Cultura do Estado, em parceria com o Ministério da Cultura.',
          entityName: 'Secretaria de Cultura do Estado',
          category: 'Música',
          budget: 1500000,
          openingDate: new Date('2024-03-01'),
          closingDate: new Date('2024-04-30'),
          evaluationDate: new Date('2024-05-15'),
          resultDate: new Date('2024-05-30'),
          status: 'open',
          requirements: [
            'Ser pessoa física ou jurídica com atuação cultural comprovada',
            'Ter pelo menos 2 anos de experiência na área cultural',
            'Estar em dia com obrigações fiscais e tributárias',
            'Apresentar proposta completa conforme modelo disponibilizado',
            'Não ter projetos em execução financiados por outros editais públicos'
          ],
          documents: [
            'Documento de identificação (RG e CPF ou CNPJ)',
            'Comprovante de residência ou sede',
            'Portfólio ou currículo artístico',
            'Certidões negativas de débitos',
            'Formulário de projeto preenchido',
            'Planilha orçamentária detalhada',
            'Declaração de não impedimento'
          ],
          attachments: [
            {
              id: '1',
              name: 'Edital Completo.pdf',
              url: '#',
              type: 'application/pdf'
            },
            {
              id: '2',
              name: 'Formulário de Inscrição.docx',
              url: '#',
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            },
            {
              id: '3',
              name: 'Planilha Orçamentária.xlsx',
              url: '#',
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
          ]
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
  }, [id]);

  // Função para lidar com a inscrição no edital
  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para se inscrever.');
      navigate('/login');
      return;
    }

    // Simulação de inscrição
    toast.success('Inscrição iniciada! Redirecionando para o formulário...');
    navigate(`/notices/${id}/apply`);
  };

  // Função para lidar com a exclusão do edital (apenas para administradores)
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este edital? Esta ação não pode ser desfeita.')) {
      try {
        // Em produção, substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success('Edital excluído com sucesso!');
        navigate('/notices');
      } catch (error) {
        console.error('Erro ao excluir edital:', error);
        toast.error('Erro ao excluir edital.');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navegação e ações */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <Link
          to="/notices"
          className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Voltar para Editais</span>
        </Link>

        {/* Ações administrativas */}
        {isAuthenticated && user?.role === 'admin' && (
          <div className="flex space-x-3">
            <Link
              to={`/notices/${notice.id}/edit`}
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
      </div>

      {/* Cabeçalho do edital */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(notice.status)}`}>
              {translateStatus(notice.status)}
            </span>
            <span className="text-sm text-gray-500">{notice.category}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{notice.title}</h1>
          
          {/* Metadados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={18} className="mr-2 text-gray-400" />
              <span>{notice.entityName}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign size={18} className="mr-2 text-gray-400" />
              <span>Orçamento: {formatCurrency(notice.budget)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={18} className="mr-2 text-gray-400" />
              <span>Inscrições: {formatDate(notice.openingDate)} a {formatDate(notice.closingDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={18} className="mr-2 text-gray-400" />
              {notice.status === 'open' ? (
                <span>
                  Encerra em{' '}
                  {Math.ceil(
                    (new Date(notice.closingDate).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  dias
                </span>
              ) : (
                <span>
                  {notice.status === 'evaluation' ? 'Em avaliação' : 
                   notice.status === 'result' ? 'Resultado em ' + formatDate(notice.resultDate) : 
                   notice.status === 'closed' ? 'Encerrado' : 'Rascunho'}
                </span>
              )}
            </div>
          </div>
          
          {/* Descrição */}
          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Descrição</h2>
            <p className="text-gray-700">{notice.description}</p>
          </div>
          
          {/* Requisitos */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Requisitos</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {notice.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
          
          {/* Documentos necessários */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Documentos Necessários</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {notice.documents.map((document, index) => (
                <li key={index}>{document}</li>
              ))}
            </ul>
          </div>
          
          {/* Anexos */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Anexos</h2>
            <div className="space-y-3">
              {notice.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  download
                  className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FileText size={20} className="text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{attachment.name}</p>
                    <p className="text-xs text-gray-500">{attachment.type.split('/')[1].toUpperCase()}</p>
                  </div>
                  <Download size={18} className="text-gray-400" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Cronograma */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Cronograma</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-24 font-medium text-gray-900">Abertura:</div>
                <div className="text-gray-700">{formatDate(notice.openingDate)}</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-24 font-medium text-gray-900">Encerramento:</div>
                <div className="text-gray-700">{formatDate(notice.closingDate)}</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-24 font-medium text-gray-900">Avaliação:</div>
                <div className="text-gray-700">{formatDate(notice.evaluationDate)}</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-24 font-medium text-gray-900">Resultado:</div>
                <div className="text-gray-700">{formatDate(notice.resultDate)}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rodapé com botão de inscrição */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          {notice.status === 'open' ? (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div>
                <p className="text-sm text-gray-600">
                  Inscrições abertas até {formatDate(notice.closingDate)}
                </p>
              </div>
              <button
                onClick={handleApply}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <CheckCircle size={18} className="mr-2" />
                Inscrever-se
              </button>
            </div>
          ) : notice.status === 'draft' ? (
            <p className="text-sm text-gray-600 text-center">Este edital está em rascunho e ainda não está aberto para inscrições.</p>
          ) : notice.status === 'evaluation' ? (
            <p className="text-sm text-gray-600 text-center">As inscrições estão encerradas. Os projetos estão em fase de avaliação.</p>
          ) : notice.status === 'result' ? (
            <p className="text-sm text-gray-600 text-center">As inscrições estão encerradas. Os resultados serão divulgados em {formatDate(notice.resultDate)}.</p>
          ) : (
            <p className="text-sm text-gray-600 text-center">Este edital está encerrado e não aceita mais inscrições.</p>
          )}
        </div>
      </div>
    </div>
  );
}; 