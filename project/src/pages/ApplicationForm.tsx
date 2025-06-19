import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { FileUpload } from '../components/Upload/FileUpload';
import { useAuthStore } from '../store/authStore';
import { mockNotices as notices } from '../mocks/data';
import { Notice } from '../types';

// Passos do formulário
const steps = [
  'Informações Básicas',
  'Descrição do Projeto',
  'Orçamento',
  'Documentos',
  'Revisão'
];

// Interface para dados do formulário
interface FormData {
  title: string;
  description: string;
  objectives: string;
  targetAudience: string;
  methodology: string;
  timeline: string;
  expectedResults: string;
  requestedValue: number;
  counterpart: number;
  justification: string;
  budget: BudgetItem[];
  team: TeamMember[];
  documents: File[];
  termsAccepted: boolean;
}

// Interfaces para itens de orçamento e membros da equipe
interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  category: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
}

export const ApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const editalId = searchParams.get('editalId');
  const { user, isAuthenticated } = useAuthStore();
  
  // Estados
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    objectives: '',
    targetAudience: '',
    methodology: '',
    timeline: '',
    expectedResults: '',
    requestedValue: 0,
    counterpart: 0,
    justification: '',
    budget: [],
    team: [],
    documents: [],
    termsAccepted: false
  });
  
  const isEditMode = !!id;

  // Carregar dados do edital e da inscrição (se em modo de edição)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Carregar dados do edital
        if (editalId) {
          const foundNotice = notices.find(n => n.id === editalId);
          if (foundNotice) {
            setNotice(foundNotice);
          } else {
            setError('Edital não encontrado');
          }
        }
        
        // Carregar dados da inscrição em caso de edição
        if (isEditMode) {
          // Simulação de chamada à API
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Dados simulados de uma inscrição
          setFormData({
            title: 'Projeto Cultural Exemplo',
            description: 'Descrição detalhada do projeto cultural',
            objectives: 'Promover a cultura local através de eventos e oficinas',
            targetAudience: 'Comunidade em geral, com foco em jovens',
            methodology: 'Abordagem participativa com atividades interativas',
            timeline: 'Duração de 6 meses, com atividades semanais',
            expectedResults: 'Impacto cultural na comunidade e formação de agentes culturais',
            requestedValue: 45000,
            counterpart: 5000,
            justification: 'Necessidade de fomento para desenvolvimento cultural local',
            budget: [
              {
                id: '1',
                description: 'Equipamento de som',
                quantity: 1,
                unitValue: 5000,
                totalValue: 5000,
                category: 'Equipamentos'
              },
              {
                id: '2',
                description: 'Contratação de oficineiros',
                quantity: 10,
                unitValue: 2000,
                totalValue: 20000,
                category: 'Serviços'
              }
            ],
            team: [
              {
                id: '1',
                name: 'João Silva',
                role: 'Coordenador',
                experience: '10 anos de experiência em produção cultural'
              },
              {
                id: '2',
                name: 'Maria Oliveira',
                role: 'Produtora',
                experience: '5 anos de experiência em projetos culturais'
              }
            ],
            documents: [],
            termsAccepted: true
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Ocorreu um erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode, editalId]);

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Manipuladores de eventos
  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Adicionar item de orçamento
  const addBudgetItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitValue: 0,
      totalValue: 0,
      category: 'Serviços'
    };
    
    setFormData(prev => ({
      ...prev,
      budget: [...prev.budget, newItem]
    }));
  };

  // Atualizar item de orçamento
  const updateBudgetItem = (id: string, field: keyof BudgetItem, value: any) => {
    setFormData(prev => {
      const updatedBudget = prev.budget.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalcular o valor total se quantidade ou valor unitário mudar
          if (field === 'quantity' || field === 'unitValue') {
            updatedItem.totalValue = updatedItem.quantity * updatedItem.unitValue;
          }
          
          return updatedItem;
        }
        return item;
      });
      
      return { ...prev, budget: updatedBudget };
    });
  };

  // Remover item de orçamento
  const removeBudgetItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      budget: prev.budget.filter(item => item.id !== id)
    }));
  };

  // Adicionar membro da equipe
  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
      experience: ''
    };
    
    setFormData(prev => ({
      ...prev,
      team: [...prev.team, newMember]
    }));
  };

  // Atualizar membro da equipe
  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  };

  // Remover membro da equipe
  const removeTeamMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(member => member.id !== id)
    }));
  };

  // Adicionar documentos
  const handleFileUpload = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  // Remover documento
  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Calcular valor total do orçamento
  const calculateTotalBudget = () => {
    return formData.budget.reduce((sum, item) => sum + item.totalValue, 0);
  };

  // Validar etapa atual
  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0: // Informações Básicas
        if (!formData.title || !formData.description) {
          setError('Preencha todos os campos obrigatórios.');
          return false;
        }
        setError(null);
        return true;
        
      case 1: // Descrição do Projeto
        if (!formData.objectives || !formData.methodology || !formData.expectedResults) {
          setError('Preencha todos os campos obrigatórios.');
          return false;
        }
        setError(null);
        return true;
        
      case 2: // Orçamento
        if (formData.budget.length === 0) {
          setError('Adicione pelo menos um item ao orçamento.');
          return false;
        }
        
        if (formData.budget.some(item => !item.description || item.totalValue <= 0)) {
          setError('Todos os itens do orçamento devem ter descrição e valor válido.');
          return false;
        }
        
        const totalBudget = calculateTotalBudget();
        if (notice && notice.maxValue && totalBudget > notice.maxValue) {
          setError(`O valor total do orçamento não pode exceder ${notice.maxValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`);
          return false;
        }
        
        setError(null);
        return true;
        
      case 3: // Documentos
        if (formData.documents.length === 0) {
          setError('Anexe pelo menos um documento.');
          return false;
        }
        setError(null);
        return true;
        
      case 4: // Revisão
        if (!formData.termsAccepted) {
          setError('Você precisa aceitar os termos e condições.');
          return false;
        }
        setError(null);
        return true;
        
      default:
        return true;
    }
  };

  // Enviar formulário
  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    setSubmitting(true);
    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulação de sucesso
      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
      navigate('/applications');
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setError('Ocorreu um erro ao enviar o formulário. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizar conteúdo de cada etapa
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Informações Básicas
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Título do Projeto"
                name="title"
                value={formData.title}
                onChange={handleTextChange}
                variant="outlined"
                helperText="Nome completo do seu projeto cultural"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Descrição do Projeto"
                name="description"
                value={formData.description}
                onChange={handleTextChange}
                variant="outlined"
                helperText="Descreva o seu projeto de forma resumida (até 500 caracteres)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Justificativa"
                name="justification"
                value={formData.justification}
                onChange={handleTextChange}
                variant="outlined"
                multiline
                rows={4}
                helperText="Por que este projeto é importante e relevante?"
              />
            </Grid>
          </Grid>
        );
        
      case 1: // Descrição do Projeto
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Objetivos"
                name="objectives"
                value={formData.objectives}
                onChange={handleTextChange}
                variant="outlined"
                helperText="Descreva os objetivos gerais e específicos do projeto"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Público-alvo"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleTextChange}
                variant="outlined"
                helperText="Quem são as pessoas que serão beneficiadas pelo projeto"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Metodologia"
                name="methodology"
                value={formData.methodology}
                onChange={handleTextChange}
                variant="outlined"
                helperText="Como o projeto será executado, incluindo abordagens e processos"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cronograma"
                name="timeline"
                value={formData.timeline}
                onChange={handleTextChange}
                variant="outlined"
                helperText="Descrição do cronograma de execução do projeto"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Resultados Esperados"
                name="expectedResults"
                value={formData.expectedResults}
                onChange={handleTextChange}
                variant="outlined"
                helperText="Descreva os impactos e resultados esperados do projeto"
              />
            </Grid>
          </Grid>
        );
        
      case 2: // Orçamento
        return (
          <Box>
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Valor Solicitado (R$)"
                  name="requestedValue"
                  type="number"
                  value={formData.requestedValue}
                  onChange={handleNumberChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  helperText={`Valor máximo: ${notice?.maxValue?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contrapartida (R$)"
                  name="counterpart"
                  type="number"
                  value={formData.counterpart}
                  onChange={handleNumberChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  helperText="Valor da contrapartida (opcional)"
                />
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              Itens do Orçamento
            </Typography>
            
            <Box sx={{ mb: 2, maxHeight: 400, overflow: 'auto' }}>
              {formData.budget.map((item, index) => (
                <Paper key={item.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Descrição do Item"
                        value={item.description}
                        onChange={(e) => updateBudgetItem(item.id, 'description', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="Quantidade"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateBudgetItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        required
                        label="Valor Unitário (R$)"
              type="number"
                        value={item.unitValue}
                        onChange={(e) => updateBudgetItem(item.id, 'unitValue', parseFloat(e.target.value) || 0)}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Valor Total (R$)"
                        value={item.totalValue.toFixed(2)}
                        disabled
                        variant="outlined"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Categoria"
                        value={item.category}
                        onChange={(e) => updateBudgetItem(item.id, 'category', e.target.value)}
                        variant="outlined"
                      >
                        <MenuItem value="Serviços">Serviços</MenuItem>
                        <MenuItem value="Equipamentos">Equipamentos</MenuItem>
                        <MenuItem value="Material">Material</MenuItem>
                        <MenuItem value="Transporte">Transporte</MenuItem>
                        <MenuItem value="Alimentação">Alimentação</MenuItem>
                        <MenuItem value="Hospedagem">Hospedagem</MenuItem>
                        <MenuItem value="Divulgação">Divulgação</MenuItem>
                        <MenuItem value="Outros">Outros</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeBudgetItem(item.id)}
                      >
                        Remover
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={addBudgetItem}
              >
                Adicionar Item
              </Button>
              
              <Typography variant="h6">
                Total: {calculateTotalBudget().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Typography>
            </Box>
          </Box>
        );
        
      case 3: // Documentos
        return (
          <Box>
            <Typography variant="body1" paragraph>
              Faça o upload dos documentos necessários para a inscrição.
              Os formatos aceitos são PDF, JPG, PNG (máximo de 10MB por arquivo).
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <FileUpload onUpload={handleFileUpload} maxFiles={10} maxSize={10} />
            </Paper>
            
            <Typography variant="h6" gutterBottom>
              Documentos Anexados ({formData.documents.length})
            </Typography>
            
            {formData.documents.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Nenhum documento anexado. Anexe pelo menos um documento para continuar.
              </Alert>
            ) : (
              <Box sx={{ mb: 2, maxHeight: 300, overflow: 'auto' }}>
                <Grid container spacing={2}>
                  {formData.documents.map((file, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1">{file.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeDocument(index)}
                        >
                          Remover
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            <Typography variant="body2" color="textSecondary">
              * Certifique-se de anexar todos os documentos exigidos no edital.
            </Typography>
          </Box>
        );
        
      case 4: // Revisão
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Revisão da Inscrição
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1">Informações Básicas</Typography>
              <Typography><strong>Título:</strong> {formData.title}</Typography>
              <Typography><strong>Descrição:</strong> {formData.description}</Typography>
              <Typography><strong>Justificativa:</strong> {formData.justification}</Typography>
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1">Detalhes do Projeto</Typography>
              <Typography><strong>Objetivos:</strong> {formData.objectives}</Typography>
              <Typography><strong>Público-alvo:</strong> {formData.targetAudience}</Typography>
              <Typography><strong>Metodologia:</strong> {formData.methodology}</Typography>
              <Typography><strong>Cronograma:</strong> {formData.timeline}</Typography>
              <Typography><strong>Resultados Esperados:</strong> {formData.expectedResults}</Typography>
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1">Orçamento</Typography>
              <Typography>
                <strong>Valor Solicitado:</strong> {formData.requestedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Typography>
              <Typography>
                <strong>Contrapartida:</strong> {formData.counterpart.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Typography>
              <Typography>
                <strong>Total:</strong> {calculateTotalBudget().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Typography>
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1">Documentos Anexados</Typography>
              {formData.documents.map((file, index) => (
                <Typography key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</Typography>
              ))}
            </Paper>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.termsAccepted}
                  onChange={handleCheckboxChange}
                  name="termsAccepted"
                />
              }
              label="Declaro que li e concordo com os termos e condições do edital e que todas as informações fornecidas são verdadeiras."
            />
          </Box>
        );
        
      default:
        return 'Etapa desconhecida';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Sua inscrição foi enviada com sucesso!
          </Alert>
          <Typography paragraph>
            Em breve você receberá um e-mail de confirmação com os detalhes da sua inscrição.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/applications')}
          >
            Ver Minhas Inscrições
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Editar Inscrição' : 'Nova Inscrição'}
        </Typography>
        
        {notice && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Edital: {notice.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Data Limite: {notice.endDate ? new Date(notice.endDate).toLocaleDateString('pt-BR') : 'Não definida'}
            </Typography>
          </Box>
        )}
        
        <Divider sx={{ mb: 3 }} />
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Voltar
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ minWidth: 120 }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Enviar'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Próximo
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}; 