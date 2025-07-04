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
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
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
        // Chamada à API com os filtros aplicados
        const params = {
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          query: searchTerm || undefined,
          page: pagination.page,
          limit: pagination.limit
        };

        const data = await noticeService.getAll(params);
        
        // Verificar se data tem o formato esperado
        if (data && data.notices) {
          // Marcar os editais que são da cidade do usuário
          // Os primeiros editais retornados pelo backend são os da cidade do usuário
          const userCityNotices = [];
          const otherNotices = [];
          
          // Separar os editais da cidade do usuário dos demais
          for (const notice of data.notices) {
            if (user && user.cityId && notice.cityId === user.cityId) {
              notice.isFromUserCity = true;
              userCityNotices.push(notice);
            } else {
              notice.isFromUserCity = false;
              otherNotices.push(notice);
            }
          }
          
          // Combinar os editais, com os da cidade do usuário primeiro
          setNotices([...userCityNotices, ...otherNotices]);
          setPagination(data.pagination || {
            total: data.notices.length,
            page: 1,
            limit: 10,
            pages: 1
          });
        } else {
          console.error('Formato de resposta inesperado:', data);
          setNotices(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Erro ao carregar editais:', error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [selectedStatus, selectedCategory, searchTerm, pagination.page, user]);

  // Filtragem de editais
  const filteredNotices = notices;

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
        <div>
          {/* Editais da cidade do usuário */}
          {isAuthenticated && user?.cityId && filteredNotices.some(notice => notice.isFromUserCity) && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Editais da sua cidade</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotices
                  .filter(notice => notice.isFromUserCity)
                  .map((notice) => (
                    <Link
                      to={`/notices/${notice.id}`}
                      key={notice.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-purple-500"
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
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar size={16} className="mr-2" />
                            <span>Inscrições: {formatDate(notice.startDate)} até {formatDate(notice.endDate)}</span>
                          </div>
                          
                          {notice.city && (
                            <div className="flex items-center text-gray-600">
                              <MapPin size={16} className="mr-2" />
                              <span>{notice.city.name} - {notice.city.state}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center text-gray-600">
                            <DollarSign size={16} className="mr-2" />
                            <span>Valor: {formatCurrency(notice.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {/* Outros editais */}
          <div>
            {isAuthenticated && user?.cityId && filteredNotices.some(notice => notice.isFromUserCity) && (
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Outros editais</h2>
            )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotices
                .filter(notice => !notice.isFromUserCity)
                .map((notice) => (
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
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2" />
                          <span>Inscrições: {formatDate(notice.startDate)} até {formatDate(notice.endDate)}</span>
                  </div>
                        
                        {notice.city && (
                          <div className="flex items-center text-gray-600">
                            <MapPin size={16} className="mr-2" />
                            <span>{notice.city.name} - {notice.city.state}</span>
                  </div>
                        )}
                        
                        <div className="flex items-center text-gray-600">
                          <DollarSign size={16} className="mr-2" />
                          <span>Valor: {formatCurrency(notice.totalAmount)}</span>
                  </div>
                </div>
              </div>
                  </Link>
                ))}
                  </div>
                </div>
              </div>
      )}

      {/* Paginação */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className={`px-3 py-1 rounded-md ${
                pagination.page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Anterior
            </button>
            
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                className={`px-3 py-1 rounded-md ${
                  pagination.page === i + 1
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
          ))}
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
              disabled={pagination.page === pagination.pages}
              className={`px-3 py-1 rounded-md ${
                pagination.page === pagination.pages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Próxima
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}; 

export default Notices;