import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText, Calendar, Clock, AlertCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

// Tipos simulados (serão substituídos pelos reais da API)
interface Application {
  id: string;
  noticeId: string;
  noticeTitle: string;
  projectTitle: string;
  entityName: string;
  submittedAt: Date;
  status: 'draft' | 'submitted' | 'under_evaluation' | 'approved' | 'rejected' | 'in_appeal';
  requestedAmount: number;
  category: string;
}

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { user } = useAuthStore();

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
        return <FileText size={16} />;
      case 'submitted':
        return <CheckCircle size={16} />;
      case 'under_evaluation':
        return <Clock size={16} />;
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'in_appeal':
        return <AlertCircle size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  // Efeito para carregar as inscrições
  useEffect(() => {
    // Simulação de chamada à API
    const fetchApplications = async () => {
      setLoading(true);
      try {
        // Em produção, substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados simulados
        const mockApplications: Application[] = [
          {
            id: '1',
            noticeId: '1',
            noticeTitle: 'Edital de Apoio à Cultura 2024',
            projectTitle: 'Festival de Música Independente',
            entityName: 'Secretaria de Cultura do Estado',
            submittedAt: new Date('2024-03-15'),
            status: 'under_evaluation',
            requestedAmount: 45000,
            category: 'Música',
          },
          {
            id: '2',
            noticeId: '2',
            noticeTitle: 'Prêmio de Artes Visuais',
            projectTitle: 'Exposição Fotográfica "Olhares da Cidade"',
            entityName: 'Fundação Municipal de Cultura',
            submittedAt: new Date('2024-02-28'),
            status: 'approved',
            requestedAmount: 25000,
            category: 'Artes Visuais',
          },
          {
            id: '3',
            noticeId: '3',
            noticeTitle: 'Edital de Audiovisual',
            projectTitle: 'Curta-metragem "Memórias"',
            entityName: 'Secretaria Nacional do Audiovisual',
            submittedAt: new Date('2024-02-10'),
            status: 'rejected',
            requestedAmount: 60000,
            category: 'Audiovisual',
          },
          {
            id: '4',
            noticeId: '5',
            noticeTitle: 'Edital de Patrimônio Cultural',
            projectTitle: 'Restauração de Casarão Histórico',
            entityName: 'Instituto do Patrimônio Histórico',
            submittedAt: new Date('2024-03-20'),
            status: 'submitted',
            requestedAmount: 85000,
            category: 'Patrimônio',
          },
          {
            id: '5',
            noticeId: '4',
            noticeTitle: 'Programa de Incentivo à Literatura',
            projectTitle: 'Antologia de Contos Regionais',
            entityName: 'Fundação Biblioteca Nacional',
            submittedAt: new Date('2024-03-01'),
            status: 'draft',
            requestedAmount: 15000,
            category: 'Literatura',
          },
        ];

        setApplications(mockApplications);
      } catch (error) {
        console.error('Erro ao carregar inscrições:', error);
        toast.error('Erro ao carregar suas inscrições.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filtragem de inscrições
  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.noticeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || application.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Minhas Inscrições</h1>
      </div>

      {/* Filtros e busca */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar inscrições..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 focus:ring-purple-500 focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filtro por status */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="pl-10 w-full border border-gray-300 rounded-md py-2 focus:ring-purple-500 focus:border-purple-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="draft">Rascunho</option>
              <option value="submitted">Enviado</option>
              <option value="under_evaluation">Em Avaliação</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Reprovado</option>
              <option value="in_appeal">Em Recurso</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de inscrições */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Nenhuma inscrição encontrada com os filtros selecionados.</p>
          <Link
            to="/notices"
            className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Explorar Editais
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Link
              to={`/applications/${application.id}`}
              key={application.id}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{translateStatus(application.status)}</span>
                  </span>
                  <span className="text-sm text-gray-500">{application.category}</span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{application.projectTitle}</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Edital: {application.noticeTitle} - {application.entityName}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span>Enviado em: {formatDate(application.submittedAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">{formatCurrency(application.requestedAmount)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end">
                <span className="text-purple-600 text-sm font-medium flex items-center">
                  Ver detalhes
                  <ArrowRight size={16} className="ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}; 