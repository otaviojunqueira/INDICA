import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
} from '@mui/material';
import { CalendarToday, LocationOn } from '@mui/icons-material';
import { format, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuthStore } from '../../store/authStore';

interface CulturalEvent {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  city: string;
  state: string;
  eventType: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'finished';
}

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

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const CulturalCalendar: React.FC = () => {
  const [events, setEvents] = useState<CulturalEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CulturalEvent[]>([]);
  const [filters, setFilters] = useState({
    state: '',
    eventType: '',
    category: '',
  });
  const { user } = useAuthStore();
  const currentDate = new Date();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [filters, events]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/cultural-events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Se não for admin, mostrar apenas eventos do mês atual
    if (!user || user.role !== 'admin') {
      filtered = filtered.filter(event => 
        isSameMonth(new Date(event.startDate), currentDate)
      );
    }

    if (filters.state) {
      filtered = filtered.filter(event => event.state === filters.state);
    }
    if (filters.eventType) {
      filtered = filtered.filter(event => event.eventType === filters.eventType);
    }
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Ordenar por data
    filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    setFilteredEvents(filtered);
  };

  const handleFilterChange = (field: keyof typeof filters) => (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Religioso': '#d32f2f',
      'Artístico/Cultural/Folclórico': '#c2185b',
      'Rural': '#7b1fa2',
      'Esportivo': '#1976d2',
      'Gastronômico': '#00796b',
    };
    return colors[category] || '#757575';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
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
                  <MenuItem key={estado} value={estado}>
                    {estado}
                  </MenuItem>
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
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
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
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        {filteredEvents.map(event => (
          <Paper
            key={event.id}
            sx={{
              mb: 2,
              p: 2,
              borderLeft: 6,
              borderColor: getCategoryColor(event.category),
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: getCategoryColor(event.category) }}>
                    {format(new Date(event.startDate), 'dd', { locale: ptBR })}
                  </Typography>
                  <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
                    {format(new Date(event.startDate), 'MMM', { locale: ptBR })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(event.endDate), 'dd MMM yy', { locale: ptBR })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={10}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      backgroundColor: getCategoryColor(event.category),
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'inline-block',
                      mb: 1,
                    }}
                  >
                    {event.category}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ fontSize: 18, mr: 0.5 }} />
                      <Typography variant="body2">
                        {event.city}/{event.state}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ fontSize: 18, mr: 0.5 }} />
                      <Typography variant="body2">
                        {event.status === 'ongoing' ? 'ACONTECENDO' : 'EM BREVE'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default CulturalCalendar; 