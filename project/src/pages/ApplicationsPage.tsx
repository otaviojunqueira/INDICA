import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuthStore } from '../store/authStore';

// Dados simulados para as inscrições do usuário
const mockApplications = [
  {
    id: '1',
    title: 'Festival de Música Comunitária',
    noticeId: '1',
    noticeTitle: 'Edital de Fomento à Música',
    submissionDate: '2023-05-10T14:30:00',
    status: 'under_review',
    requestedValue: 45000,
    returnDate: null,
    comments: null
  },
  {
    id: '2',
    title: 'Oficinas de Arte para Jovens',
    noticeId: '2',
    noticeTitle: 'Edital de Oficinas Culturais',
    submissionDate: '2023-04-22T09:15:00',
    status: 'approved',
    requestedValue: 30000,
    returnDate: '2023-05-15T11:20:00',
    comments: 'Projeto aprovado com ressalvas quanto ao cronograma.'
  },
  {
    id: '3',
    title: 'Documentário sobre Cultura Local',
    noticeId: '3',
    noticeTitle: 'Edital de Audiovisual',
    submissionDate: '2023-06-01T16:45:00',
    status: 'rejected',
    requestedValue: 60000,
    returnDate: '2023-06-20T10:30:00',
    comments: 'Projeto não atendeu aos requisitos mínimos do edital.'
  },
  {
    id: '4',
    title: 'Mostra de Artes Visuais',
    noticeId: '1',
    noticeTitle: 'Edital de Fomento às Artes',
    submissionDate: '2023-07-05T11:00:00',
    status: 'draft',
    requestedValue: 25000,
    returnDate: null,
    comments: null
  }
];

// Interface para tipo de inscrição
interface Application {
  id: string;
  title: string;
  noticeId: string;
  noticeTitle: string;
  submissionDate: string;
  status: 'draft' | 'under_review' | 'approved' | 'rejected' | 'pending_adjustment';
  requestedValue: number;
  returnDate: string | null;
  comments: string | null;
}

// Função para retornar a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
      return 'default';
    case 'under_review':
      return 'info';
    case 'pending_adjustment':
      return 'warning';
      case 'approved':
      return 'success';
      case 'rejected':
      return 'error';
      default:
      return 'default';
    }
  };

  // Função para traduzir o status
const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
    case 'under_review':
      return 'Em Análise';
    case 'pending_adjustment':
      return 'Ajustes Pendentes';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Reprovado';
      default:
      return 'Desconhecido';
  }
};

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  // Estados
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Carregar inscrições do usuário
  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        // Simulação de chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Usar dados simulados
        setApplications(mockApplications);
      } catch (error) {
        console.error('Erro ao carregar inscrições:', error);
        setError('Ocorreu um erro ao carregar as inscrições. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  // Abrir menu de ações
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, application: Application) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplication(application);
  };

  // Fechar menu de ações
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Visualizar inscrição
  const handleViewApplication = () => {
    if (selectedApplication) {
      navigate(`/application/${selectedApplication.id}`);
    }
    handleMenuClose();
  };

  // Editar inscrição
  const handleEditApplication = () => {
    if (selectedApplication) {
      navigate(`/application/${selectedApplication.id}/edit`);
    }
    handleMenuClose();
  };

  // Abrir diálogo de confirmação de exclusão
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  // Fechar diálogo de confirmação de exclusão
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Excluir inscrição
  const handleDeleteApplication = async () => {
    if (!selectedApplication) return;
    
    setDeleting(true);
    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remover inscrição da lista
      setApplications(prev => prev.filter(app => app.id !== selectedApplication.id));
    } catch (error) {
      console.error('Erro ao excluir inscrição:', error);
      setError('Ocorreu um erro ao excluir a inscrição. Tente novamente.');
    } finally {
      setDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  // Criar nova inscrição
  const handleNewApplication = () => {
    navigate('/application/new');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Minhas Inscrições
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNewApplication}
        >
          Nova Inscrição
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {applications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography paragraph>
            Você ainda não possui inscrições em editais.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/notices')}
          >
            Ver Editais Disponíveis
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {applications.map((application) => (
            <Grid item xs={12} md={6} key={application.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {application.title}
                    </Typography>
                    <IconButton 
                      aria-label="mais opções" 
                      onClick={(e) => handleMenuOpen(e, application)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Edital: {application.noticeTitle}
                  </Typography>
                  
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Chip 
                      label={getStatusText(application.status)}
                      color={getStatusColor(application.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Valor Solicitado:</strong> {application.requestedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Data de Envio:</strong> {new Date(application.submissionDate).toLocaleDateString('pt-BR')}
                    </Typography>
                    
                    {application.returnDate && (
                      <Typography variant="body2">
                        <strong>Data de Resposta:</strong> {new Date(application.returnDate).toLocaleDateString('pt-BR')}
                      </Typography>
                    )}
                  </Box>
                  
                  {application.comments && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2">
                        <strong>Comentários:</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {application.comments}
                      </Typography>
                    </>
                  )}
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<VisibilityIcon />} 
                    onClick={() => navigate(`/application/${application.id}`)}
                  >
                    Visualizar
                  </Button>
                  
                  {['draft', 'pending_adjustment'].includes(application.status) && (
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/application/${application.id}/edit`)}
                    >
                      Editar
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu de ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewApplication}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Visualizar
        </MenuItem>
        
        {selectedApplication && ['draft', 'pending_adjustment'].includes(selectedApplication.status) && (
          <MenuItem onClick={handleEditApplication}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Editar
          </MenuItem>
        )}
        
        {selectedApplication && ['draft'].includes(selectedApplication.status) && (
          <MenuItem onClick={handleOpenDeleteDialog}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Excluir
          </MenuItem>
        )}
      </Menu>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir esta inscrição? Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteApplication}
            color="error" 
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 