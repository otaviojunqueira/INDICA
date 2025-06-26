import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Calendar, MapPin, DollarSign, Clock, Tag } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

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
  status: 'draft' | 'open' | 'evaluation' | 'result' | 'closed';
}

const Notices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user, isAuthenticated } = useAuthStore();

  // Categorias simuladas
  const categories = ['Música', 'Teatro', 'Dança', 'Artes Visuais', 'Literatura', 'Audiovisual', 'Patrimônio', 'Outros'];

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

  // Efeito para carregar os editais
  useEffect(() => {
    // Simulação de chamada à API
    const fetchNotices = async () => {
      setLoading(true);
      try {
        // Em produção, substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados simulados
        const mockNotices: Notice[] = [
          {
            id: '1',
            title: 'Edital de Apoio à Cultura 2024',
            description: 'Apoio a projetos culturais nas áreas de música, teatro e dança.',
            entityName: 'Secretaria de Cultura do Estado',
            category: 'Música',
            budget: 1500000,
            openingDate: new Date('2024-03-01'),
            closingDate: new Date('2024-04-30'),
            status: 'open',
          },
          {
            id: '2',
            title: 'Prêmio de Artes Visuais',
            description: 'Premiação para artistas visuais com obras inéditas.',
            entityName: 'Fundação Municipal de Cultura',
            category: 'Artes Visuais',
            budget: 500000,
            openingDate: new Date('2024-02-15'),
            closingDate: new Date('2024-03-15'),
            status: 'evaluation',
          },
          {
            id: '3',
            title: 'Edital de Audiovisual',
            description: 'Financiamento para produção de curtas e longas-metragens.',
            entityName: 'Secretaria Nacional do Audiovisual',
            category: 'Audiovisual',
            budget: 3000000,
            openingDate: new Date('2024-01-10'),
            closingDate: new Date('2024-02-28'),
            status: 'closed',
          },
          {
            id: '4',
            title: 'Programa de Incentivo à Literatura',
            description: 'Apoio à publicação de obras literárias de novos autores.',
            entityName: 'Fundação Biblioteca Nacional',
            category: 'Literatura',
            budget: 800000,
            openingDate: new Date('2024-04-01'),
            closingDate: new Date('2024-05-31'),
            status: 'draft',
          },
          {
            id: '5',
            title: 'Edital de Patrimônio Cultural',
            description: 'Preservação e restauro de patrimônio histórico.',
            entityName: 'Instituto do Patrimônio Histórico',
            category: 'Patrimônio',
            budget: 2500000,
            openingDate: new Date('2024-03-15'),
            closingDate: new Date('2024-06-15'),
            status: 'open',
          },
        ];

        setNotices(mockNotices);
      } catch (error) {
        console.error('Erro ao carregar editais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Filtragem de editais
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || notice.status === selectedStatus;
    
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editais Culturais</h1>
        
        {/* Botão de criar edital (apenas para administradores) */}
        {isAuthenticated && user?.role === 'admin' && (
          <Link
            to="/notices/create"
            className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-purple-700 transition-colors"
          >
            <Plus size={18} />
            <span>Novo Edital</span>
          </Link>
        )}
      </div>

      {/* Filtros e busca */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar editais..."
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
              <option value="open">Aberto</option>
              <option value="evaluation">Em Avaliação</option>
              <option value="result">Resultado</option>
              <option value="closed">Encerrado</option>
            </select>
          </div>
          
          {/* Filtro por categoria */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag size={18} className="text-gray-400" />
            </div>
            <select
              className="pl-10 w-full border border-gray-300 rounded-md py-2 focus:ring-purple-500 focus:border-purple-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas os setores culturais</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de editais */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Nenhum edital encontrado com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <Link
              to={`/notices/${notice.id}`}
              key={notice.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-5">
                {/* Status */}
                <div className="flex justify-between items-center mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(notice.status)}`}>
                    {translateStatus(notice.status)}
                  </span>
                  <span className="text-sm text-gray-500">{notice.category}</span>
                </div>
                
                {/* Título e descrição */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{notice.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{notice.description}</p>
                
                {/* Metadados */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <span>{notice.entityName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign size={16} className="mr-2 text-gray-400" />
                    <span>{formatCurrency(notice.budget)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span>
                      {formatDate(notice.openingDate)} a {formatDate(notice.closingDate)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Rodapé */}
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {notice.status === 'open' ? (
                      <span>
                        Encerra em{' '}
                        {Math.ceil(
                          (new Date(notice.closingDate).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        dias
                      </span>
                    ) : notice.status === 'closed' ? (
                      <span>Encerrado</span>
                    ) : (
                      <span>{translateStatus(notice.status)}</span>
                    )}
                  </div>
                  <span className="text-purple-600 text-sm font-medium">Ver detalhes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}; 

export default Notices;