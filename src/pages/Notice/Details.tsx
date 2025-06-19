import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CalendarToday,
  AttachMoney,
  LocationOn,
  Info
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { mockNotices } from '../../mocks/data';
import { Notice } from '../../types';

export const NoticeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const fetchNoticeDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Simulação de chamada API
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Buscar dos dados simulados
        const foundNotice = mockNotices.find(notice => notice.id === id);
        if (!foundNotice) {
          setError('Edital não encontrado.');
          return;
        }
        
        setNotice(foundNotice);
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar detalhes do edital:', error);
        setError('Erro ao carregar detalhes do edital. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNoticeDetails();
  }, [id]);

  const handleStartApplication = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    navigate(`/applications/new?editalId=${id}`);
  };
  
  const formatDate = (date: string | undefined) => {
    if (!date) return 'Data não definida';
    return new Date(date).toLocaleDateString('pt-BR');
  };
  
  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error || !notice) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Edital não encontrado.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/notices')}>
          Voltar para Lista de Editais
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {notice.title}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip 
                label={notice.status === 'open' ? 'Aberto' : 
                       notice.status === 'closed' ? 'Fechado' :
                       notice.status === 'evaluation' ? 'Em avaliação' :
                       notice.status === 'finished' ? 'Resultado publicado' : 
                       'Rascunho'}
                color={notice.status === 'open' ? 'success' : 
                       notice.status === 'closed' ? 'error' :
                       notice.status === 'evaluation' ? 'warning' : 
                       notice.status === 'finished' ? 'info' : 'default'}
              />
              
              {notice.areas?.map((area, index) => (
                <Chip key={index} label={area} />
              ))}
            </Box>
            
            <Typography variant="body1" paragraph>
              {notice.description}
            </Typography>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '300px' } }}>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Informações Gerais
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Local" 
                    secondary={`${notice.city}, ${notice.state}`} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Período de Inscrições" 
                    secondary={`${formatDate(notice.startDate)} até ${formatDate(notice.endDate)}`} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <AttachMoney color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Valor por Projeto" 
                    secondary={`Até ${formatCurrency(notice.maxValue)}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Info color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Orçamento Total" 
                    secondary={formatCurrency(notice.totalAmount)} 
                  />
                </ListItem>
              </List>
              
              {notice.status === 'open' && (
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={handleStartApplication}
                  >
                    Inscrever-se
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Requisitos
        </Typography>
        
        <List>
          {notice.requirements?.map((req, index) => (
            <ListItem key={index}>
              <ListItemText primary={req} />
            </ListItem>
          ))}
        </List>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        <Button 
          variant="outlined"
          onClick={() => navigate('/notices')}
        >
          Voltar para Lista de Editais
        </Button>
      </Box>
    </Container>
  );
}; 