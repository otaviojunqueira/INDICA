import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import evaluatorService from '../../services/evaluator.service';

interface FormData {
  name: string;
  email: string;
  culturalSector: string;
  specialties: string[];
  biography: string;
  education: string;
  experience: string;
}

const culturalSectors = [
  'Artes Visuais',
  'Audiovisual',
  'Circo',
  'Dança',
  'Literatura',
  'Música',
  'Teatro',
  'Patrimônio Cultural',
  'Cultura Popular',
  'Artesanato',
  'Outros'
];

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

const NewEvaluatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    culturalSector: '',
    specialties: [],
    biography: '',
    education: '',
    experience: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSectorChange = (e: SelectChangeEvent<string>) => {
    const sector = e.target.value;
    setFormData(prev => ({
      ...prev,
      culturalSector: sector,
      specialties: [] // Limpar especialidades ao mudar o setor
    }));
  };

  const handleSpecialtiesChange = (e: SelectChangeEvent<string[]>) => {
    const specialties = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
    setFormData(prev => ({ ...prev, specialties }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.culturalSector || 
        !formData.biography || !formData.education || !formData.experience) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }
    if (formData.specialties.length === 0) {
      setError('Por favor, selecione pelo menos uma especialidade');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor, insira um email válido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await evaluatorService.createEvaluator(formData);
      setSuccess(true);
      // Mostrar credenciais temporariamente
      setTimeout(() => {
        navigate('/admin/evaluators');
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar parecerista');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastrar Novo Parecerista
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Parecerista cadastrado com sucesso! As credenciais foram enviadas para o email cadastrado.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Setor Cultural</InputLabel>
                <Select
                  value={formData.culturalSector}
                  onChange={handleSectorChange}
                  label="Setor Cultural"
                >
                  {culturalSectors.map(sector => (
                    <MenuItem key={sector} value={sector}>
                      {sector}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

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
                  {formData.culturalSector && specialtiesBySector[formData.culturalSector]?.map(specialty => (
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
                  {loading ? 'Cadastrando...' : 'Cadastrar Parecerista'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default NewEvaluatorPage;
