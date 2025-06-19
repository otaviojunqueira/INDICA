import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  CalendarToday,
  AttachMoney,
  LocationOn,
  Category,
  AccessTime,
  ChevronRight,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { mockNotices as notices } from '../../mocks/data';
import { Notice } from '../../types';

// Interface para filtros
interface NoticeFilters {
  search: string;
  category: string;
  status: string;
  city: string;
  minValue: string;
  maxValue: string;
}

export const NoticeList: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allNotices, setAllNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<NoticeFilters>({
    search: '',
    category: '',
    status: '',
    city: '',
    minValue: '',
    maxValue: ''
  });
  const [savedNotices, setSavedNotices] = useState<string[]>([]);
  
  // Categorias disponíveis para filtro
  const categories = [
    'Música',
    'Teatro',
    'Dança',
    'Literatura',
    'Artes Visuais',
    'Audiovisual',
    'Patrimônio',
    'Fotografia',
    'Todas'
  ];
  
  // Status dos editais
  const statuses = [
    'open',
    'closed',
    'evaluation',
    'result',
    'draft'
  ];

  // Carregar editais
  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        // Aqui seria uma chamada API real
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Usando dados simulados
        const mockNotices = [...notices, 
          // Adicionando mais editais de exemplo
          {
            id: '3',
            title: 'Programa de Fomento à Música',
            description: 'Apoio a eventos musicais, shows e gravações de álbuns',
            entityId: '2',
            entityName: 'Secretaria Estadual de Cultura',
            startDate: new Date('2023-07-01'),
            endDate: new Date('2023-08-15'),
            budget: 800000,
            maxValue: 80000,
            minValue: 15000,
            status: 'open',
            categories: ['musica', 'evento'],
            requirements: ['portfolio', 'projeto', 'orcamento', 'cronograma'],
            rules: 'Conforme documento anexo',
            createdAt: new Date('2023-06-10'),
            updatedAt: new Date('2023-06-10')
          },
          {
            id: '4',
            title: 'Edital de Apoio à Cultura Popular',
            description: 'Financiamento de projetos que valorizem manifestações culturais tradicionais',
            entityId: '3',
            entityName: 'Fundação Nacional de Artes',
            startDate: new Date('2023-06-20'),
            endDate: new Date('2023-08-20'),
            budget: 1200000,
            maxValue: 100000,
            minValue: 20000,
            status: 'open',
            categories: ['cultura_popular', 'patrimonio'],
            requirements: ['portfolio', 'projeto', 'orcamento', 'fotos'],
            rules: 'Conforme documento anexo',
            createdAt: new Date('2023-06-05'),
            updatedAt: new Date('2023-06-05')
          },
          {
            id: '5',
            title: 'Edital de Circulação de Espetáculos',
            description: 'Apoio para turnês de espetáculos teatrais e de dança',
            entityId: '2',
            entityName: 'Secretaria Estadual de Cultura',
            startDate: new Date('2023-05-10'),
            endDate: new Date('2023-06-30'),
            budget: 600000,
            maxValue: 60000,
            minValue: 10000,
            status: 'evaluation',
            categories: ['teatro', 'danca', 'circulacao'],
            requirements: ['portfolio', 'projeto', 'orcamento', 'rider_tecnico'],
            rules: 'Conforme documento anexo',
            createdAt: new Date('2023-05-01'),
            updatedAt: new Date('2023-05-01')
          }
        ];
        
        setAllNotices(mockNotices);
        setFilteredNotices(mockNotices);
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar editais:", error);
        setError("Erro ao carregar os editais. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Filtrar editais quando os filtros mudarem
  useEffect(() => {
    const applyFilters = () => {
      let result = [...allNotices];
      
      // Aplicar filtro de pesquisa por texto
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(notice => 
          notice.title.toLowerCase().includes(searchTerm) || 
          notice.description.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filtrar por categoria
      if (filters.category && filters.category !== 'Todas') {
        const categoryLower = filters.category.toLowerCase();
        result = result.filter(notice => 
          notice.categories?.some(cat => cat.toLowerCase().includes(categoryLower))
        );
      }
      
      // Filtrar por status
      if (filters.status && filters.status !== 'all') {
        result = result.filter(notice => notice.status === filters.status);
      }
      
      // Filtrar por cidade
      if (filters.city) {
        const cityLower = filters.city.toLowerCase();
        result = result.filter(notice => 
          notice.entityName?.toLowerCase().includes(cityLower)
        );
      }
      
      // Filtrar por valor mínimo
      if (filters.minValue) {
        const minValue = parseFloat(filters.minValue);
        result = result.filter(notice => (notice.minValue || 0) >= minValue);
      }
      
      // Filtrar por valor máximo
      if (filters.maxValue) {
        const maxValue = parseFloat(filters.maxValue);
        result = result.filter(notice => (notice.maxValue || 0) <= maxValue);
      }
      
      // Filtrar por tab selecionada
      if (activeTab === 1) { // Editais abertos
        result = result.filter(notice => notice.status === 'open');
      } else if (activeTab === 2) { // Editais fechados/encerrados
        result = result.filter(notice => notice.status === 'closed');
      } else if (activeTab === 3) { // Editais salvos
        result = result.filter(notice => savedNotices.includes(notice.id));
      }
      
      setFilteredNotices(result);
    };
    
    applyFilters();
  }, [filters, allNotices, activeTab, savedNotices]);

  // Manipular mudança de aba
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Alternar exibição dos filtros
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Atualizar filtros
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: '',
      city: '',
      minValue: '',
      maxValue: ''
    });
  };

  // Alternar edital salvo/favorito
  const toggleSavedNotice = (id: string) => {
    if (savedNotices.includes(id)) {
      setSavedNotices(savedNotices.filter(noticeId => noticeId !== id));
    } else {
      setSavedNotices([...savedNotices, id]);
    }
  };

  // Navegar para detalhes do edital
  const goToNoticeDetails = (id: string) => {
    navigate(`/notices/${id}`);
  };

  // Renderizar cada card de edital
  const renderNoticeCard = (notice: Notice) => {
    const isSaved = savedNotices.includes(notice.id);
    
    return (
      <Grid item xs={12} md={6} lg={4} key={notice.id}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" gutterBottom>
                {notice.title}
              </Typography>
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSavedNotice(notice.id);
                }}
              >
                {isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
              </IconButton>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              {notice.description.length > 100 
                ? `${notice.description.substring(0, 100)}...` 
                : notice.description}
            </Typography>
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {notice.entityName}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {notice.startDate && new Date(notice.startDate).toLocaleDateString('pt-BR')} até {notice.endDate && new Date(notice.endDate).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoney fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                R$ {notice.minValue?.toLocaleString('pt-BR')} até R$ {notice.maxValue?.toLocaleString('pt-BR')}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {notice.categories?.map((category, index) => (
                <Chip 
                  key={index} 
                  label={category} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
              ))}
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Chip 
                label={notice.status === 'open' ? 'Aberto' : 
                       notice.status === 'closed' ? 'Fechado' :
                       notice.status === 'evaluation' ? 'Em avaliação' :
                       notice.status === 'result' ? 'Resultado publicado' : 
                       'Rascunho'}
                color={notice.status === 'open' ? 'success' : 
                       notice.status === 'closed' ? 'error' :
                       notice.status === 'evaluation' ? 'warning' : 
                       notice.status === 'result' ? 'info' : 'default'}
                size="small"
              />
            </Box>
          </CardContent>
          <CardActions>
            <Button 
              size="small" 
              onClick={() => goToNoticeDetails(notice.id)}
              endIcon={<ChevronRight />}
            >
              Ver Detalhes
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  // Renderizar área de filtros
  const renderFilters = () => {
    if (!showFilters) return null;
    
    return (
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Filtros</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoria</InputLabel>
              <Select
                name="category"
                value={filters.category}
                label="Categoria"
                onChange={handleFilterChange as any}
              >
                <MenuItem value="">Todas</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                label="Status"
                onChange={handleFilterChange as any}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="open">Aberto</MenuItem>
                <MenuItem value="closed">Fechado</MenuItem>
                <MenuItem value="evaluation">Em avaliação</MenuItem>
                <MenuItem value="result">Resultado publicado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              name="city"
              label="Cidade/Estado"
              variant="outlined"
              size="small"
              fullWidth
              value={filters.city}
              onChange={handleFilterChange}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                name="minValue"
                label="Valor Min"
                variant="outlined"
                size="small"
                fullWidth
                type="number"
                value={filters.minValue}
                onChange={handleFilterChange}
              />
              <TextField
                name="maxValue"
                label="Valor Max"
                variant="outlined"
                size="small"
                fullWidth
                type="number"
                value={filters.maxValue}
                onChange={handleFilterChange}
              />
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={clearFilters} sx={{ mr: 1 }}>
            Limpar Filtros
          </Button>
        </Box>
      </Paper>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Editais
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'space-between' }}>
          <TextField
            placeholder="Pesquisar editais"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ maxWidth: { md: '50%' } }}
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={toggleFilters}
          >
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Button>
        </Box>
        
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          <Tab label="Todos" />
          <Tab label="Abertos" />
          <Tab label="Encerrados" />
          <Tab label="Salvos" />
        </Tabs>
      </Paper>
      
      {renderFilters()}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredNotices.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Nenhum edital encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente modificar os filtros ou a pesquisa para ver mais resultados.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredNotices.map((notice) => renderNoticeCard(notice))}
        </Grid>
      )}
    </Container>
  );
}; 