import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import api from '../../config/axios';
import { useNavigate } from 'react-router-dom';

interface Evaluator {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  specialties: string[];
  biography: string;
  education: string;
  experience: string;
  isActive: boolean;
}

const EvaluatorsManagementPage: React.FC = () => {
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState<Evaluator | null>(null);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });
  
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Carregar pareceristas
  useEffect(() => {
    const fetchEvaluators = async () => {
      try {
        setLoading(true);
        const response = await api.get('/evaluators', {
          params: {
            query: searchTerm || undefined,
            specialty: specialty || undefined
          }
        });
        setEvaluators(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar pareceristas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvaluators();
  }, [searchTerm, specialty]);
  
  // Alternar status do parecerista (ativar/desativar)
  const handleToggleStatus = async (evaluatorId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/evaluators/${evaluatorId}/status`, {
        isActive: !currentStatus
      });
      
      // Atualizar lista local
      setEvaluators(prev => 
        prev.map(ev => 
          ev._id === evaluatorId ? { ...ev, isActive: !currentStatus } : ev
        )
      );
      
      setNotification({
        open: true,
        message: `Parecerista ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`,
        type: 'success'
      });
    } catch (err: any) {
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Erro ao alterar status do parecerista',
        type: 'error'
      });
    }
  };
  
  // Abrir modal para visualizar detalhes do parecerista
  const handleOpenDetails = (evaluator: Evaluator) => {
    setSelectedEvaluator(evaluator);
    setOpenDialog(true);
  };
  
  // Fechar modal
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvaluator(null);
  };
  
  // Fechar notificação
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Gerenciamento de Pareceristas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/evaluators/new')}
        >
          Novo Parecerista
        </Button>
      </Box>
      
      {/* Filtros e busca */}
      <Box mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar parecerista"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filtrar por especialidade</InputLabel>
              <Select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value as string)}
                label="Filtrar por especialidade"
                startAdornment={<FilterIcon color="action" sx={{ mr: 1 }} />}
              >
                <MenuItem value="">Todas as especialidades</MenuItem>
                <MenuItem value="música">Música</MenuItem>
                <MenuItem value="teatro">Teatro</MenuItem>
                <MenuItem value="dança">Dança</MenuItem>
                <MenuItem value="artes visuais">Artes Visuais</MenuItem>
                <MenuItem value="literatura">Literatura</MenuItem>
                <MenuItem value="audiovisual">Audiovisual</MenuItem>
                <MenuItem value="patrimônio">Patrimônio Cultural</MenuItem>
                <MenuItem value="cultura popular">Cultura Popular</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      {/* Listagem de pareceristas */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : evaluators.length === 0 ? (
        <Alert severity="info">Nenhum parecerista encontrado</Alert>
      ) : (
        <Grid container spacing={3}>
          {evaluators.map((evaluator) => (
            <Grid item xs={12} md={6} lg={4} key={evaluator._id}>
              <Card 
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: evaluator.isActive ? 1 : 0.7
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {evaluator.userId.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {evaluator.userId.email}
                  </Typography>
                  <Box mt={2} mb={1}>
                    <Typography variant="subtitle2">Especialidades:</Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                      {evaluator.specialties.map((specialty, index) => (
                        <Chip 
                          key={index} 
                          label={specialty} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {evaluator.biography.substring(0, 100)}
                    {evaluator.biography.length > 100 ? '...' : ''}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => handleOpenDetails(evaluator)}
                  >
                    Ver detalhes
                  </Button>
                  <Button 
                    size="small"
                    color={evaluator.isActive ? "error" : "success"}
                    onClick={() => handleToggleStatus(evaluator._id, evaluator.isActive)}
                  >
                    {evaluator.isActive ? 'Desativar' : 'Ativar'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Modal de detalhes do parecerista */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedEvaluator && (
          <>
            <DialogTitle>
              Detalhes do Parecerista
              {!selectedEvaluator.isActive && (
                <Chip 
                  label="Inativo" 
                  color="error" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              )}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Nome</Typography>
                  <Typography variant="body1">{selectedEvaluator.userId.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
                  <Typography variant="body1">{selectedEvaluator.userId.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">Especialidades</Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                    {selectedEvaluator.specialties.map((specialty, index) => (
                      <Chip 
                        key={index} 
                        label={specialty} 
                        color="primary" 
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">Biografia</Typography>
                  <Typography variant="body1">{selectedEvaluator.biography}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">Formação</Typography>
                  <Typography variant="body1">{selectedEvaluator.education}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">Experiência</Typography>
                  <Typography variant="body1">{selectedEvaluator.experience}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Fechar</Button>
              <Button 
                color="primary" 
                variant="contained"
                onClick={() => navigate(`/admin/evaluators/edit/${selectedEvaluator._id}`)}
              >
                Editar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Notificações */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EvaluatorsManagementPage; 