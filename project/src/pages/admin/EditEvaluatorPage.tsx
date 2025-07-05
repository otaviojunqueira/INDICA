import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Alert,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import evaluatorService, { Evaluator } from '../../services/evaluator.service';

interface FormData {
  specialties: string[];
  biography: string;
  education: string;
  experience: string;
}

const specialtiesBySector: { [key: string]: string[] } = {
  'Artes Visuais': ['Pintura', 'Escultura', 'Fotografia', 'Instalação', 'Arte Digital'],
  'Audiovisual': ['Cinema', 'Vídeo', 'Animação', 'Documentário', 'Produção'],
  'Circo': ['Acrobacia', 'Malabarismo', 'Palhaçaria', 'Trapézio', 'Contorcionismo'],
  'Dança': ['Ballet', 'Contemporânea', 'Popular', 'Urbana', 'Clássica'],
  'Literatura': ['Prosa', 'Poesia', 'Crítica', 'Infantil', 'Dramaturgia'],
  'Música': ['Erudita', 'Popular', 'Instrumental', 'Vocal', 'Produção Musical'],
  'Teatro': ['Direção', 'Atuação', 'Dramaturgia', 'Cenografia', 'Produção Teatral'],
  'Patrimônio Cultural': ['Material', 'Imaterial', 'Arqueológico', 'Histórico', 'Arquitetônico'],
  'Cultura Popular': ['Folclore', 'Artesanato', 'Festas Populares', 'Tradições Orais', 'Rituais'],
  'Artesanato': ['Cerâmica', 'Tecelagem', 'Madeira', 'Metal', 'Fibras Naturais'],
  'Outros': ['Gestão Cultural', 'Produção Cultural', 'Curadoria', 'Pesquisa', 'Educação']
};

const EditEvaluatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [evaluator, setEvaluator] = useState<Evaluator | null>(null);
  const [formData, setFormData] = useState<FormData>({
    specialties: [],
    biography: '',
    education: '',
    experience: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadEvaluator = async () => {
      try {
        if (!id) return;
        const data = await evaluatorService.getEvaluatorById(id);
        setEvaluator(data);
        setFormData({
          specialties: data.specialties,
          biography: data.biography,
          education: data.education,
          experience: data.experience
        });
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || 'Erro ao carregar dados do parecerista');
      } finally {
        setLoading(false);
      }
    };

    loadEvaluator();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecialtiesChange = (e: SelectChangeEvent<string[]>) => {
    const specialties = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
    setFormData(prev => ({ ...prev, specialties }));
  };

  const validateForm = () => {
    if (!formData.biography || !formData.education || !formData.experience) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }
    if (formData.specialties.length === 0) {
      setError('Por favor, selecione pelo menos uma especialidade');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm() || !id) {
      return;
    }

    setLoading(true);

    try {
      await evaluatorService.updateEvaluator(id, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/evaluators');
      }, 2000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Erro ao atualizar parecerista');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  if (!evaluator) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Parecerista não encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Parecerista
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Nome: {evaluator.userId.name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Email: {evaluator.userId.email}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Setor Cultural: {evaluator.culturalSector}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Parecerista atualizado com sucesso!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Especialidades</InputLabel>
                <Select
                  multiple
                  value={formData.specialties}
                  onChange={handleSpecialtiesChange}
                  label="Especialidades"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {evaluator.culturalSector && specialtiesBySector[evaluator.culturalSector]?.map(specialty => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Selecione uma ou mais especialidades</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biografia"
                name="biography"
                multiline
                rows={4}
                value={formData.biography}
                onChange={handleInputChange}
                required
                helperText="Descreva a experiência profissional e trajetória do parecerista"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Formação"
                name="education"
                multiline
                rows={3}
                value={formData.education}
                onChange={handleInputChange}
                required
                helperText="Descreva a formação acadêmica e cursos relevantes"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Experiência"
                name="experience"
                multiline
                rows={3}
                value={formData.experience}
                onChange={handleInputChange}
                required
                helperText="Descreva a experiência específica no setor cultural selecionado"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/evaluators')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditEvaluatorPage; 