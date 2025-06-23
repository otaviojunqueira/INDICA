import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  Chip, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress 
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { Notice } from '../types';
import { mockNoticeService } from '../mocks/mockServices';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case 'open': return 'success';
    case 'closed': return 'error';
    case 'draft': return 'default';
    case 'evaluation': return 'warning';
    case 'finished': return 'info';
    default: return 'default';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'open': return 'Aberto';
    case 'closed': return 'Fechado';
    case 'draft': return 'Rascunho';
    case 'evaluation': return 'Em Avaliação';
    case 'finished': return 'Finalizado';
    default: return 'Desconhecido';
  }
}

const NoticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        if (!id) {
          setError("ID do edital não fornecido");
          setLoading(false);
          return;
        }
        
        const noticeData = await mockNoticeService.getNotice(id);
        setNotice(noticeData);
      } catch (error) {
        console.error("Erro ao carregar edital:", error);
        setError("Não foi possível carregar os detalhes do edital");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error || !notice) {
    return (
      <Container>
        <Box mt={4}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || "Edital não encontrado"}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/notices')}
          >
            Voltar para Editais
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {/* Botão de voltar */}
        <Box mb={4}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/notices')}
          >
            Voltar para Editais
          </Button>
        </Box>
        
        {/* Título e detalhes principais */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom>
                {notice.title}
              </Typography>
              
              <Box mb={2}>
                <Chip 
                  label={getStatusText(notice.status)} 
                  color={getStatusColor(notice.status) as any}
                />
              </Box>
              
              <Typography variant="body1" paragraph>
                {notice.description}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Informações Gerais
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Período:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {formatDate(notice.startDate)} - {formatDate(notice.endDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Valor Total:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {notice.totalAmount.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      })}
                    </Typography>
                  </Grid>
                  
                  {notice.maxValue && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Valor Máximo por Projeto:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {notice.maxValue.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Áreas:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {notice.areas.map((area, index) => (
                        <Chip 
                          key={index} 
                          label={area} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                  
                  {notice.city && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Cidade:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {notice.city}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  
                  {notice.state && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Estado:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {notice.state}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
                
                {isAuthenticated && notice.status === 'open' && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    component={RouterLink}
                    to={`/applications/new?notice=${notice.id}`}
                  >
                    Inscrever-se
                  </Button>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
          
          {/* Requisitos */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Requisitos
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {notice.requirements.map((req, index) => (
              <ListItem key={index} divider={index < notice.requirements.length - 1}>
                <ListItemText primary={req} />
              </ListItem>
            ))}
          </List>
        </Paper>
        
        {/* Cronograma */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Cronograma
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {notice.steps.map((step, index) => (
              <ListItem key={index} divider={index < notice.steps.length - 1}>
                <ListItemText 
                  primary={step.name} 
                  secondary={`${formatDate(step.startDate)} - ${formatDate(step.endDate)}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        
        {/* Critérios de Avaliação */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Critérios de Avaliação
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {notice.evaluationCriteria.map((criteria, index) => (
              <ListItem key={index} divider={index < notice.evaluationCriteria.length - 1}>
                <ListItemText 
                  primary={`${criteria.name} (Peso: ${criteria.weight})`} 
                  secondary={criteria.description}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        
        {/* Documentação Necessária */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Documentação Necessária
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {notice.documents.map((doc, index) => (
              <ListItem key={index} divider={index < notice.documents.length - 1}>
                <ListItemText primary={doc} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default NoticeDetail; 