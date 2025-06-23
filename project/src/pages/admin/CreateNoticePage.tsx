import React, { useState, useEffect } from 'react';
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
  IconButton,
  Divider,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { noticeService } from '../../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

interface Entity {
  _id: string;
  name: string;
}

interface EvaluationCriteria {
  name: string;
  weight: number;
  description: string;
}

const CreateNoticePage: React.FC = () => {
  const navigate = useNavigate();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    entityId: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    totalAmount: '',
    maxApplicationValue: '',
    minApplicationValue: '',
    categories: [] as string[],
    newCategory: '',
    requirements: [] as string[],
    newRequirement: '',
    documents: [] as string[],
    newDocument: '',
    evaluationCriteria: [] as EvaluationCriteria[],
  });

  // Estado para novo critério de avaliação
  const [newCriteria, setNewCriteria] = useState({
    name: '',
    weight: 1,
    description: '',
  });

  // Validação de formulário
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    entityId: '',
    startDate: '',
    endDate: '',
    totalAmount: '',
    maxApplicationValue: '',
    minApplicationValue: '',
    categories: '',
    evaluationCriteria: '',
  });

  // Carregar entidades
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        // Aqui seria uma chamada à API para buscar entidades
        // Por enquanto, vamos simular com dados estáticos
        setEntities([
          { _id: '1', name: 'Secretaria de Cultura Municipal' },
          { _id: '2', name: 'Secretaria de Cultura Estadual' },
          { _id: '3', name: 'Ministério da Cultura' },
        ]);
      } catch (err) {
        console.error('Erro ao carregar entidades:', err);
      }
    };

    fetchEntities();
  }, []);

  // Manipuladores de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name: string) => (date: Date | null) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  // Manipuladores para arrays (categorias, requisitos, documentos)
  const handleAddItem = (field: string, newItemField: string) => () => {
    if (formData[newItemField as keyof typeof formData]) {
      setFormData({
        ...formData,
        [field]: [...(formData[field as keyof typeof formData] as string[]), formData[newItemField as keyof typeof formData]],
        [newItemField]: '',
      });
    }
  };

  const handleRemoveItem = (field: string, index: number) => () => {
    const newArray = [...(formData[field as keyof typeof formData] as string[])];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  // Manipuladores para critérios de avaliação
  const handleCriteriaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCriteria({
      ...newCriteria,
      [name]: name === 'weight' ? Number(value) : value,
    });
  };

  const handleAddCriteria = () => {
    if (newCriteria.name && newCriteria.description) {
      setFormData({
        ...formData,
        evaluationCriteria: [...formData.evaluationCriteria, { ...newCriteria }],
      });
      setNewCriteria({
        name: '',
        weight: 1,
        description: '',
      });
    }
  };

  const handleRemoveCriteria = (index: number) => () => {
    const newCriteria = [...formData.evaluationCriteria];
    newCriteria.splice(index, 1);
    setFormData({
      ...formData,
      evaluationCriteria: newCriteria,
    });
  };

  // Validação do formulário
  const validateForm = () => {
    const errors = {
      title: '',
      description: '',
      entityId: '',
      startDate: '',
      endDate: '',
      totalAmount: '',
      maxApplicationValue: '',
      minApplicationValue: '',
      categories: '',
      evaluationCriteria: '',
    };

    let isValid = true;

    if (!formData.title) {
      errors.title = 'O título é obrigatório';
      isValid = false;
    }

    if (!formData.description) {
      errors.description = 'A descrição é obrigatória';
      isValid = false;
    }

    if (!formData.entityId) {
      errors.entityId = 'A entidade é obrigatória';
      isValid = false;
    }

    if (!formData.startDate) {
      errors.startDate = 'A data de início é obrigatória';
      isValid = false;
    }

    if (!formData.endDate) {
      errors.endDate = 'A data de término é obrigatória';
      isValid = false;
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      errors.endDate = 'A data de término deve ser posterior à data de início';
      isValid = false;
    }

    if (!formData.totalAmount) {
      errors.totalAmount = 'O valor total é obrigatório';
      isValid = false;
    } else if (isNaN(Number(formData.totalAmount)) || Number(formData.totalAmount) <= 0) {
      errors.totalAmount = 'O valor total deve ser um número positivo';
      isValid = false;
    }

    if (!formData.maxApplicationValue) {
      errors.maxApplicationValue = 'O valor máximo por inscrição é obrigatório';
      isValid = false;
    } else if (isNaN(Number(formData.maxApplicationValue)) || Number(formData.maxApplicationValue) <= 0) {
      errors.maxApplicationValue = 'O valor máximo deve ser um número positivo';
      isValid = false;
    }

    if (!formData.minApplicationValue) {
      errors.minApplicationValue = 'O valor mínimo por inscrição é obrigatório';
      isValid = false;
    } else if (isNaN(Number(formData.minApplicationValue)) || Number(formData.minApplicationValue) <= 0) {
      errors.minApplicationValue = 'O valor mínimo deve ser um número positivo';
      isValid = false;
    }

    if (Number(formData.minApplicationValue) > Number(formData.maxApplicationValue)) {
      errors.minApplicationValue = 'O valor mínimo não pode ser maior que o valor máximo';
      isValid = false;
    }

    if (formData.categories.length === 0) {
      errors.categories = 'Adicione pelo menos uma categoria';
      isValid = false;
    }

    if (formData.evaluationCriteria.length === 0) {
      errors.evaluationCriteria = 'Adicione pelo menos um critério de avaliação';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const noticeData = {
        title: formData.title,
        description: formData.description,
        entityId: formData.entityId,
        startDate: formData.startDate ? formData.startDate : new Date(),
        endDate: formData.endDate ? formData.endDate : new Date(),
        totalAmount: Number(formData.totalAmount),
        maxApplicationValue: Number(formData.maxApplicationValue),
        minApplicationValue: Number(formData.minApplicationValue),
        categories: formData.categories,
        requirements: formData.requirements,
        documents: formData.documents,
        evaluationCriteria: formData.evaluationCriteria,
        budget: Number(formData.totalAmount)
      };

      await noticeService.create(noticeData);
      navigate('/admin/notices');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Ocorreu um erro ao criar o edital');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Criar Novo Edital
        </Typography>

        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informações básicas */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informações Básicas
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título do Edital"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                error={!!formErrors.description}
                helperText={formErrors.description}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.entityId}>
                <InputLabel>Entidade</InputLabel>
                <Select
                  name="entityId"
                  value={formData.entityId}
                  onChange={handleSelectChange}
                  label="Entidade"
                  required
                >
                  {entities.map((entity) => (
                    <MenuItem key={entity._id} value={entity._id}>
                      {entity.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.entityId && <FormHelperText>{formErrors.entityId}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Datas e valores */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Período e Valores
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data de Início"
                  value={formData.startDate}
                  onChange={handleDateChange('startDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formErrors.startDate,
                      helperText: formErrors.startDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data de Término"
                  value={formData.endDate}
                  onChange={handleDateChange('endDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!formErrors.endDate,
                      helperText: formErrors.endDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor Total do Edital (R$)"
                name="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={handleInputChange}
                error={!!formErrors.totalAmount}
                helperText={formErrors.totalAmount}
                required
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor Mínimo por Inscrição (R$)"
                name="minApplicationValue"
                type="number"
                value={formData.minApplicationValue}
                onChange={handleInputChange}
                error={!!formErrors.minApplicationValue}
                helperText={formErrors.minApplicationValue}
                required
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor Máximo por Inscrição (R$)"
                name="maxApplicationValue"
                type="number"
                value={formData.maxApplicationValue}
                onChange={handleInputChange}
                error={!!formErrors.maxApplicationValue}
                helperText={formErrors.maxApplicationValue}
                required
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>

            {/* Categorias */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Categorias
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="Nova Categoria"
                  name="newCategory"
                  value={formData.newCategory}
                  onChange={handleInputChange}
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddItem('categories', 'newCategory')}
                  startIcon={<AddIcon />}
                >
                  Adicionar
                </Button>
              </Box>
              {formErrors.categories && (
                <FormHelperText error>{formErrors.categories}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formData.categories.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    onDelete={handleRemoveItem('categories', index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            {/* Requisitos */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Requisitos
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="Novo Requisito"
                  name="newRequirement"
                  value={formData.newRequirement}
                  onChange={handleInputChange}
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddItem('requirements', 'newRequirement')}
                  startIcon={<AddIcon />}
                >
                  Adicionar
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {formData.requirements.length > 0 ? (
                <Box component="ul" sx={{ pl: 2 }}>
                  {formData.requirements.map((requirement, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography>{requirement}</Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={handleRemoveItem('requirements', index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">Nenhum requisito adicionado</Typography>
              )}
            </Grid>

            {/* Documentos */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Documentos Necessários
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="Novo Documento"
                  name="newDocument"
                  value={formData.newDocument}
                  onChange={handleInputChange}
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddItem('documents', 'newDocument')}
                  startIcon={<AddIcon />}
                >
                  Adicionar
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {formData.documents.length > 0 ? (
                <Box component="ul" sx={{ pl: 2 }}>
                  {formData.documents.map((document, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography>{document}</Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={handleRemoveItem('documents', index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">Nenhum documento adicionado</Typography>
              )}
            </Grid>

            {/* Critérios de Avaliação */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Critérios de Avaliação
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Nome do Critério"
                      name="name"
                      value={newCriteria.name}
                      onChange={handleCriteriaChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Peso"
                      name="weight"
                      type="number"
                      value={newCriteria.weight}
                      onChange={handleCriteriaChange}
                      inputProps={{ min: 1, max: 10 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      name="description"
                      value={newCriteria.description}
                      onChange={handleCriteriaChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddCriteria}
                      startIcon={<AddIcon />}
                      fullWidth
                    >
                      Adicionar Critério
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              {formErrors.evaluationCriteria && (
                <FormHelperText error>{formErrors.evaluationCriteria}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              {formData.evaluationCriteria.length > 0 ? (
                <Grid container spacing={2}>
                  {formData.evaluationCriteria.map((criteria, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1">{criteria.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {criteria.description}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            Peso: {criteria.weight}
                          </Typography>
                        </Box>
                        <IconButton
                          color="error"
                          onClick={handleRemoveCriteria(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary">Nenhum critério adicionado</Typography>
              )}
            </Grid>

            {/* Botões de ação */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/admin/notices')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Criar Edital'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

// Exportação padrão
export default CreateNoticePage; 