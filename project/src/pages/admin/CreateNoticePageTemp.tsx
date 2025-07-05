import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';
import noticeService from '../../services/notice.service';

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
    // Novos campos do modelo MinC
    quotas: {
      blackQuota: 0,
      indigenousQuota: 0,
      disabilityQuota: 0
    },
    accessibility: {
      physical: [] as string[],
      communicational: [] as string[],
      attitudinal: [] as string[]
    },
    stages: [] as {
      name: string;
      startDate: Date | null;
      endDate: Date | null;
      description: string;
    }[],
    appealPeriod: {
      selectionAppealDays: 3,
      habilitationAppealDays: 3
    },
    habilitationDocuments: [] as {
      name: string;
      description: string;
      required: boolean;
    }[],
    budget: {
      totalAmount: 0,
      maxValue: 0,
      minValue: 0,
      allowedExpenses: [] as string[]
    }
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

  // Manipuladores para novos campos
  const handleQuotaChange = (field: keyof typeof formData.quotas) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      quotas: {
        ...formData.quotas,
        [field]: Number(e.target.value)
      }
    });
  };

  const handleAccessibilityChange = (type: keyof typeof formData.accessibility) => (items: string[]) => {
    setFormData({
      ...formData,
      accessibility: {
        ...formData.accessibility,
        [type]: items
      }
    });
  };

  const handleStageChange = (index: number, field: string, value: any) => {
    const newStages = [...formData.stages];
    (newStages[index] as any)[field] = value;
    setFormData({
      ...formData,
      stages: newStages
    });
  };

  const handleAppealPeriodChange = (field: keyof typeof formData.appealPeriod) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      appealPeriod: {
        ...formData.appealPeriod,
        [field]: Number(e.target.value)
      }
    });
  };

  const handleHabilitationDocumentChange = (index: number, field: string, value: any) => {
    const newDocs = [...formData.habilitationDocuments];
    (newDocs[index] as any)[field] = value;
    setFormData({
      ...formData,
      habilitationDocuments: newDocs
    });
  };

  const handleBudgetChange = (field: keyof typeof formData.budget) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      budget: {
        ...formData.budget,
        [field]: field === 'allowedExpenses' ? e.target.value.split(',') : Number(e.target.value)
      }
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
    }

    if (!formData.maxApplicationValue) {
      errors.maxApplicationValue = 'O valor máximo por inscrição é obrigatório';
      isValid = false;
    }

    if (!formData.minApplicationValue) {
      errors.minApplicationValue = 'O valor mínimo por inscrição é obrigatório';
      isValid = false;
    }

    if (formData.categories.length === 0) {
      errors.categories = 'Pelo menos uma categoria é obrigatória';
      isValid = false;
    }

    if (formData.evaluationCriteria.length === 0) {
      errors.evaluationCriteria = 'Pelo menos um critério de avaliação é obrigatório';
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
        quotas: formData.quotas,
        accessibility: formData.accessibility,
        stages: formData.stages,
        appealPeriod: formData.appealPeriod,
        habilitationDocuments: formData.habilitationDocuments,
        budget: formData.budget
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
                  required
                >
                  {entities.map((entity) => (
                    <MenuItem key={entity._id} value={entity._id}>
                      {entity.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.entityId && (
                  <FormHelperText>{formErrors.entityId}</FormHelperText>
                )}
              </FormControl>
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

            {/* Cotas */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Cotas
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cota para Pessoas Negras (%)"
                type="number"
                value={formData.quotas.blackQuota}
                onChange={handleQuotaChange('blackQuota')}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cota para Pessoas Indígenas (%)"
                type="number"
                value={formData.quotas.indigenousQuota}
                onChange={handleQuotaChange('indigenousQuota')}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cota para PCD (%)"
                type="number"
                value={formData.quotas.disabilityQuota}
                onChange={handleQuotaChange('disabilityQuota')}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>

            {/* Acessibilidade */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Acessibilidade
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Acessibilidade Física</InputLabel>
                <Select
                  multiple
                  value={formData.accessibility.physical}
                  onChange={(e) => handleAccessibilityChange('physical')(e.target.value as string[])}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                  <MenuItem value="rampas">Rampas de acesso</MenuItem>
                  <MenuItem value="elevadores">Elevadores</MenuItem>
                  <MenuItem value="banheiros">Banheiros adaptados</MenuItem>
                  <MenuItem value="estacionamento">Estacionamento acessível</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Acessibilidade Comunicacional</InputLabel>
                <Select
                  multiple
                  value={formData.accessibility.communicational}
                  onChange={(e) => handleAccessibilityChange('communicational')(e.target.value as string[])}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                  <MenuItem value="libras">Intérprete de Libras</MenuItem>
                  <MenuItem value="audioDescricao">Audiodescrição</MenuItem>
                  <MenuItem value="legendas">Legendas</MenuItem>
                  <MenuItem value="braile">Material em Braile</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Acessibilidade Atitudinal</InputLabel>
                <Select
                  multiple
                  value={formData.accessibility.attitudinal}
                  onChange={(e) => handleAccessibilityChange('attitudinal')(e.target.value as string[])}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                  <MenuItem value="treinamento">Equipe treinada</MenuItem>
                  <MenuItem value="atendimento">Atendimento prioritário</MenuItem>
                  <MenuItem value="sinalizacao">Sinalização adequada</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Etapas */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Etapas do Edital
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {formData.stages.map((stage, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Nome da Etapa"
                    value={stage.name}
                    onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                    <DatePicker
                      label="Data de Início"
                      value={stage.startDate}
                      onChange={(date) => handleStageChange(index, 'startDate', date)}
                      slotProps={{
                        textField: { fullWidth: true }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                    <DatePicker
                      label="Data de Término"
                      value={stage.endDate}
                      onChange={(date) => handleStageChange(index, 'endDate', date)}
                      slotProps={{
                        textField: { fullWidth: true }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    value={stage.description}
                    onChange={(e) => handleStageChange(index, 'description', e.target.value)}
                  />
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() => setFormData({
                  ...formData,
                  stages: [...formData.stages, {
                    name: '',
                    startDate: null,
                    endDate: null,
                    description: ''
                  }]
                })}
              >
                Adicionar Etapa
              </Button>
            </Grid>

            {/* Prazos de Recurso */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Prazos de Recurso
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prazo para Recurso da Seleção (dias)"
                type="number"
                value={formData.appealPeriod.selectionAppealDays}
                onChange={handleAppealPeriodChange('selectionAppealDays')}
                inputProps={{ min: 3 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prazo para Recurso da Habilitação (dias)"
                type="number"
                value={formData.appealPeriod.habilitationAppealDays}
                onChange={handleAppealPeriodChange('habilitationAppealDays')}
                inputProps={{ min: 3 }}
              />
            </Grid>

            {/* Documentos de Habilitação */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Documentos de Habilitação
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {formData.habilitationDocuments.map((doc, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Nome do Documento"
                    value={doc.name}
                    onChange={(e) => handleHabilitationDocumentChange(index, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    value={doc.description}
                    onChange={(e) => handleHabilitationDocumentChange(index, 'description', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={doc.required}
                        onChange={(e) => handleHabilitationDocumentChange(index, 'required', e.target.checked)}
                      />
                    }
                    label="Obrigatório"
                  />
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() => setFormData({
                  ...formData,
                  habilitationDocuments: [...formData.habilitationDocuments, {
                    name: '',
                    description: '',
                    required: true
                  }]
                })}
              >
                Adicionar Documento
              </Button>
            </Grid>

            {/* Orçamento */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Orçamento
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor Total do Edital (R$)"
                type="number"
                value={formData.budget.totalAmount}
                onChange={handleBudgetChange('totalAmount')}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor Máximo por Projeto (R$)"
                type="number"
                value={formData.budget.maxValue}
                onChange={handleBudgetChange('maxValue')}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor Mínimo por Projeto (R$)"
                type="number"
                value={formData.budget.minValue}
                onChange={handleBudgetChange('minValue')}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Despesas Permitidas (separadas por vírgula)"
                value={formData.budget.allowedExpenses.join(',')}
                onChange={handleBudgetChange('allowedExpenses')}
                helperText="Ex: Equipamentos, Serviços, Material de Consumo"
              />
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

export default CreateNoticePage; 