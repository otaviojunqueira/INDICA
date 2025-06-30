import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Calendar, MapPin, DollarSign, Clock, Tag } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import noticeService, { Notice } from '../services/notice.service';

const Notices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user, isAuthenticated } = useAuthStore();

  // Categorias de editais
  const categories = ['Música', 'Teatro', 'Dança', 'Artes Visuais', 'Literatura', 'Audiovisual', 'Patrimônio', 'Outros'];

  // Função para formatar data
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: number | undefined) => {
    if (!value && value !== 0) return 'R$ 0,00';
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
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'evaluation':
        return 'bg-yellow-100 text-yellow-800';
      case 'result':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
      case 'canceled':
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
      case 'published':
        return 'Aberto';
      case 'evaluation':
        return 'Em Avaliação';
      case 'result':
        return 'Resultado';
      case 'closed':
        return 'Encerrado';
      case 'canceled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  // Efeito para carregar os editais
  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        // Chamada real à API
        const data = await noticeService.getAll();
        // Verificar se data é um array antes de definir o estado
        if (Array.isArray(data)) {
          setNotices(data);
        } else {
          console.error('Dados de editais não estão em formato de array:', data);
          setNotices([]);
        }
      } catch (error) {
        console.error('Erro ao carregar editais:', error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Filtragem de editais
  const filteredNotices = Array.isArray(notices) ? notices.filter(notice => {
    const matchesSearch = notice?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notice?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (notice?.entity?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || notice?.status === selectedStatus;
    
    // Se tivermos categorias nos editais, filtrar por elas
    const matchesCategory = selectedCategory === 'all'; // Adaptar quando tivermos categorias no modelo
    
    return matchesSearch && matchesStatus && matchesCategory;
  }) : [];

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
              <option value="published">Aberto</option>
              <option value="evaluation">Em Avaliação</option>
              <option value="result">Resultado</option>
              <option value="closed">Encerrado</option>
              <option value="canceled">Cancelado</option>
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
                  <span className="text-sm text-gray-500">Edital</span>
                </div>
                
                {/* Título e descrição */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{notice.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{notice.description}</p>
                
                {/* Metadados */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <span>{notice.entity?.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign size={16} className="mr-2 text-gray-400" />
                    <span>{formatCurrency(notice.budget)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span>
                      {formatDate(notice.startDate)} a {formatDate(notice.endDate)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Rodapé */}
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {notice.status === 'published' ? (
                      <span>
                        Encerra em{' '}
                        {notice.registrationEndDate ? Math.ceil(
                          (new Date(notice.registrationEndDate).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) : '?'}{' '}
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