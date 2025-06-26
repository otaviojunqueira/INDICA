import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, 
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { culturalEventService, CulturalEvent } from '../../mocks/culturalEventsMock';

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const eventTypes = [
  'Assistencial',
  'Cívico',
  'Comercial',
  'Cultural',
  'Empresarial',
  'Esportivo',
  'Folclórico',
  'Gastronômico',
  'Religioso',
  'Social',
  'Técnico',
  'Outros'
];

const categories = [
  'Artístico/Cultural/Folclórico',
  'Científico ou Técnico',
  'Comercial ou Promocional',
  'Ecoturismo',
  'Esportivo',
  'Gastronômico',
  'Junino',
  'Moda',
  'Religioso',
  'Rural',
  'Social/Cívico/Histórico',
  'Outro'
];

// Função para agrupar eventos por mês
const groupEventsByMonth = (events: CulturalEvent[]) => {
  const grouped: Record<string, CulturalEvent[]> = {};
  
  events.forEach(event => {
    const month = event.startDate.getMonth();
    const year = event.startDate.getFullYear();
    const key = `${year}-${month}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(event);
  });
  
  // Ordenar os meses
  return Object.entries(grouped)
    .sort(([keyA], [keyB]) => {
      const [yearA, monthA] = keyA.split('-').map(Number);
      const [yearB, monthB] = keyB.split('-').map(Number);
      
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      
      return monthA - monthB;
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, CulturalEvent[]>);
};

// Função para formatar o nome do mês
const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month);
  
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

// Função para obter cor baseada na categoria
const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    'Artístico/Cultural/Folclórico': '#3f51b5',
    'Científico ou Técnico': '#009688',
    'Comercial ou Promocional': '#ff9800',
    'Ecoturismo': '#4caf50',
    'Esportivo': '#f44336',
    'Gastronômico': '#e91e63',
    'Junino': '#9c27b0',
    'Moda': '#795548',
    'Religioso': '#607d8b',
    'Rural': '#8bc34a',
    'Social/Cívico/Histórico': '#2196f3',
    'Outro': '#9e9e9e'
  };
  
  return colorMap[category] || '#9e9e9e';
};

const CulturalCalendar: React.FC = () => {
  const [events, setEvents] = useState<CulturalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    state: '',
    eventType: '',
    category: ''
  });
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await culturalEventService.getEvents(filters);
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar eventos:', err);
        setError('Não foi possível carregar os eventos. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [filters]);
  
  const handleFilterChange = (name: string) => (event: SelectChangeEvent) => {
    setFilters({
      ...filters,
      [name]: event.target.value
    });
  };
  
  const groupedEvents = groupEventsByMonth(events);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 2, color: 'error.main' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filters.state}
              onChange={handleFilterChange('state')}
              label="Estado"
            >
              <MenuItem value="">Todos</MenuItem>
              {estados.map(estado => (
                <MenuItem key={estado} value={estado}>{estado}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Evento</InputLabel>
            <Select
              value={filters.eventType}
              onChange={handleFilterChange('eventType')}
              label="Tipo de Evento"
            >
              <MenuItem value="">Todos</MenuItem>
              {eventTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={filters.category}
              onChange={handleFilterChange('category')}
              label="Categoria"
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {/* Calendário de Eventos */}
      {Object.keys(groupedEvents).length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Nenhum evento encontrado com os filtros selecionados.</Typography>
        </Box>
      ) : (
        Object.entries(groupedEvents).map(([monthKey, monthEvents]) => (
          <Box key={monthKey} sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textTransform: 'capitalize' }}>
              {formatMonth(monthKey)}
            </Typography>
            
            <Grid container spacing={3}>
              {monthEvents.map(event => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    <Box sx={{ 
                      height: 140, 
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundImage: `url(${event.imageUrl || 'https://source.unsplash.com/random/800x600/?event'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}>
                      <Box sx={{ 
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        p: 1,
                        boxShadow: 2
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                          {event.startDate.getDate()}
                        </Typography>
                        <Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
                          {event.startDate.toLocaleDateString('pt-BR', { month: 'short' })}
                        </Typography>
                      </Box>
                      
                      <Chip
                        label={event.category}
                        sx={{ 
                          position: 'absolute',
                          bottom: 10,
                          right: 10,
                          backgroundColor: getCategoryColor(event.category),
                          color: 'white'
                        }}
                        size="small"
                      />
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {event.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.startDate.toLocaleDateString('pt-BR')} - {event.endDate.toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.city}/{event.state}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Typography variant="body2" color="text.secondary" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {event.description}
                      </Typography>
                    </CardContent>
                    
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Chip
                        label={event.status === 'ativo' ? 'Em andamento' : 
                               event.status === 'agendado' ? 'Agendado' : 
                               event.status === 'finalizado' ? 'Finalizado' : 'Cancelado'}
                        color={event.status === 'ativo' ? 'success' : 
                               event.status === 'agendado' ? 'primary' : 
                               event.status === 'finalizado' ? 'default' : 'error'}
                        size="small"
                      />
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}
    </Box>
  );
};

export default CulturalCalendar;
