import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  TextField,
  Paper,
  Autocomplete,
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../config/axios';

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

const specialtyOptions = [
  'música',
  'teatro',
  'dança',
  'artes visuais',
  'literatura',
  'audiovisual',
  'patrimônio',
  'cultura popular',
  'artesanato',
  'circo',
  'design',
  'fotografia',
  'moda',
  'gastronomia'
];

const EditEvaluatorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });
  
  const [formData, setFormData] = useState({
    specialties: [] as string[],
    biography: '',
    education: '',
    experience: ''
  });
  
  const [evaluator, setEvaluator] = useState<Evaluator | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Carregar dados do parecerista
  useEffect(() => {
    const fetchEvaluator = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/evaluators/${id}`);
        setEvaluator(response.data);
        
        // Preencher formulário com dados existentes
        setFormData({
          specialties: response.data.specialties,
          biography: response.data.biography,
          education: response.data.education,
          experience: response.data.experience
        });
        
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar dados do parecerista');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchEvaluator();
    }
  }, [id]);
  
  // Manipular mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Manipular mudanças nas especialidades
  const handleSpecialtiesChange = (event: any, newValue: string[]) => {
    setFormData(prev => ({ ...prev, specialties: newValue }));
  };
  
  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.specialties.length === 0) {
      setError('Selecione pelo menos uma especialidade');
      return;
    }
    
    try {
      setSubmitting(true);
      await api.put(`/evaluators/${id}`, formData);
      
      setNotification({
        open: true,
        message: 'Parecerista atualizado com sucesso',
        type: 'success'
      });
      
      // Redirecionar após um breve delay
      setTimeout(() => {
        navigate('/admin/evaluators');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar parecerista');
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Erro ao atualizar parecerista',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Fechar notificação
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (!evaluator) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Parecerista não encontrado</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Parecerista
        </Typography>
        
        <Box mb={3}>
          <Typography variant="h6">
            {evaluator.userId.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {evaluator.userId.email}
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="specialties"
                options={specialtyOptions}
                value={formData.specialties}
                onChange={handleSpecialtiesChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      color="primary"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Especialidades"
                    placeholder="Selecione as especialidades"
                    required
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="biography"
                label="Biografia"
                multiline
                rows={4}
                value={formData.biography}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="education"
                label="Formação"
                multiline
                rows={3}
                value={formData.education}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="experience"
                label="Experiência"
                multiline
                rows={3}
                value={formData.experience}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/admin/evaluators')}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Salvar Alterações'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
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

export default EditEvaluatorPage; 