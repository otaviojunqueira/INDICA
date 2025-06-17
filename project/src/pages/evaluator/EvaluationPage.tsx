import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Divider,
  TextField,
  Button,
  Slider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { evaluationService, applicationService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface CriteriaScore {
  criteriaId: string;
  name: string;
  weight: number;
  score: number | null;
  comments: string;
}

interface Evaluation {
  _id: string;
  applicationId: any;
  evaluatorId: string;
  criteriaScores: CriteriaScore[];
  totalScore: number;
  comments: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: Date;
}

interface Application {
  _id: string;
  noticeId: any;
  userId: any;
  projectName: string;
  projectDescription: string;
  requestedAmount: number;
  status: string;
  formData: Record<string, any>;
  documents: Array<{
    name: string;
    path: string;
    uploadedAt: Date;
  }>;
}

const EvaluationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  
  // Estado para controlar se todos os critérios foram avaliados
  const [allCriteriaEvaluated, setAllCriteriaEvaluated] = useState<boolean>(false);

  // Carregar dados da avaliação e da inscrição
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Carregar a avaliação
        const evaluationData = await evaluationService.getById(id as string);
        setEvaluation(evaluationData);
        
        // Carregar a inscrição associada
        const applicationData = await applicationService.getById(evaluationData.applicationId._id);
        setApplication(applicationData);
        
        // Verificar se todos os critérios já foram avaliados
        checkAllCriteriaEvaluated(evaluationData.criteriaScores);
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err);
        setError(err.response?.data?.message || 'Ocorreu um erro ao carregar os dados');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);
  
  // Verificar se todos os critérios foram avaliados
  const checkAllCriteriaEvaluated = (criteriaScores: CriteriaScore[]) => {
    const allEvaluated = criteriaScores.every(criteria => 
      criteria.score !== null && criteria.score !== undefined
    );
    setAllCriteriaEvaluated(allEvaluated);
  };
  
  // Atualizar pontuação de um critério
  const handleScoreChange = (criteriaId: string) => (event: Event, newValue: number | number[]) => {
    if (!evaluation) return;
    
    const updatedScores = evaluation.criteriaScores.map(criteria => {
      if (criteria.criteriaId === criteriaId) {
        return {
          ...criteria,
          score: newValue as number
        };
      }
      return criteria;
    });
    
    setEvaluation({
      ...evaluation,
      criteriaScores: updatedScores
    });
    
    checkAllCriteriaEvaluated(updatedScores);
  };
  
  // Atualizar comentários de um critério
  const handleCriteriaCommentChange = (criteriaId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!evaluation) return;
    
    const updatedScores = evaluation.criteriaScores.map(criteria => {
      if (criteria.criteriaId === criteriaId) {
        return {
          ...criteria,
          comments: e.target.value
        };
      }
      return criteria;
    });
    
    setEvaluation({
      ...evaluation,
      criteriaScores: updatedScores
    });
  };
  
  // Atualizar comentários gerais
  const handleCommentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!evaluation) return;
    
    setEvaluation({
      ...evaluation,
      comments: e.target.value
    });
  };
  
  // Salvar avaliação como rascunho
  const handleSaveDraft = async () => {
    if (!evaluation) return;
    
    try {
      setSaving(true);
      setError(null);
      
      await evaluationService.update(evaluation._id, {
        criteriaScores: evaluation.criteriaScores,
        comments: evaluation.comments,
        status: 'in_progress'
      });
      
      setSuccess('Avaliação salva com sucesso');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar avaliação:', err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao salvar a avaliação');
    } finally {
      setSaving(false);
    }
  };
  
  // Abrir diálogo de confirmação para finalizar avaliação
  const handleOpenConfirmDialog = () => {
    if (!allCriteriaEvaluated) {
      setError('Todos os critérios devem ser avaliados antes de finalizar');
      return;
    }
    
    setConfirmDialogOpen(true);
  };
  
  // Finalizar avaliação
  const handleFinishEvaluation = async () => {
    if (!evaluation) return;
    
    try {
      setSaving(true);
      setError(null);
      setConfirmDialogOpen(false);
      
      await evaluationService.update(evaluation._id, {
        criteriaScores: evaluation.criteriaScores,
        comments: evaluation.comments,
        status: 'completed'
      });
      
      setSuccess('Avaliação finalizada com sucesso');
      setTimeout(() => {
        navigate('/evaluator/evaluations');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao finalizar avaliação:', err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao finalizar a avaliação');
    } finally {
      setSaving(false);
    }
  };
  
  // Renderizar marcadores de valor para o slider
  const valuetext = (value: number) => {
    return `${value}`;
  };
  
  // Calcular média ponderada das pontuações
  const calculateWeightedAverage = () => {
    if (!evaluation) return 0;
    
    let totalWeight = 0;
    let weightedSum = 0;
    
    evaluation.criteriaScores.forEach(criteria => {
      if (criteria.score !== null && criteria.score !== undefined) {
        weightedSum += criteria.score * criteria.weight;
        totalWeight += criteria.weight;
      }
    });
    
    return totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(2)) : 0;
  };
  
  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error && !evaluation) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  if (!evaluation || !application) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Avaliação ou inscrição não encontrada</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Grid container spacing={4}>
        {/* Informações da inscrição */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Informações da Inscrição
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Edital
              </Typography>
              <Typography variant="body1">
                {application.noticeId.title}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Projeto
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {application.projectName}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Proponente
              </Typography>
              <Typography variant="body1">
                {application.userId.name}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Valor Solicitado
              </Typography>
              <Typography variant="body1">
                R$ {application.requestedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Descrição do Projeto
            </Typography>
            <Typography variant="body2" paragraph>
              {application.projectDescription}
            </Typography>
            
            {/* Documentos */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Documentos
            </Typography>
            {application.documents.length > 0 ? (
              <List dense>
                {application.documents.map((doc, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText 
                      primary={doc.name}
                      secondary={`Enviado em ${new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhum documento anexado
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Formulário de avaliação */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                Avaliação do Projeto
              </Typography>
              
              <Chip 
                label={
                  evaluation.status === 'pending' ? 'Pendente' : 
                  evaluation.status === 'in_progress' ? 'Em Andamento' : 
                  'Concluída'
                }
                color={
                  evaluation.status === 'pending' ? 'default' : 
                  evaluation.status === 'in_progress' ? 'primary' : 
                  'success'
                }
              />
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {/* Critérios de avaliação */}
            <Typography variant="h6" gutterBottom>
              Critérios de Avaliação
            </Typography>
            
            {evaluation.criteriaScores.map((criteria, index) => (
              <Card key={criteria.criteriaId} variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {criteria.name}
                    </Typography>
                    <Chip 
                      label={`Peso ${criteria.weight}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="body2" gutterBottom>
                      Pontuação (0-10)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Slider
                        value={criteria.score || 0}
                        onChange={handleScoreChange(criteria.criteriaId)}
                        getAriaValueText={valuetext}
                        step={1}
                        marks
                        min={0}
                        max={10}
                        valueLabelDisplay="auto"
                        disabled={evaluation.status === 'completed'}
                      />
                      <Box sx={{ ml: 2, minWidth: 50 }}>
                        <Typography variant="h6" color="primary">
                          {criteria.score !== null ? criteria.score : '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Comentários sobre este critério"
                    multiline
                    rows={2}
                    value={criteria.comments || ''}
                    onChange={handleCriteriaCommentChange(criteria.criteriaId)}
                    variant="outlined"
                    disabled={evaluation.status === 'completed'}
                  />
                </CardContent>
              </Card>
            ))}
            
            {/* Comentários gerais */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Parecer Final
            </Typography>
            <TextField
              fullWidth
              label="Comentários gerais sobre o projeto"
              multiline
              rows={4}
              value={evaluation.comments || ''}
              onChange={handleCommentsChange}
              variant="outlined"
              disabled={evaluation.status === 'completed'}
              sx={{ mb: 3 }}
            />
            
            {/* Pontuação média */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                Pontuação Média:
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {calculateWeightedAverage()}
              </Typography>
            </Box>
            
            {/* Botões de ação */}
            {evaluation.status !== 'completed' && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/evaluator/evaluations')}
                    disabled={saving}
                  >
                    Voltar
                  </Button>
                  
                  <Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleSaveDraft}
                      disabled={saving}
                      sx={{ mr: 2 }}
                    >
                      {saving ? 'Salvando...' : 'Salvar Rascunho'}
                    </Button>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenConfirmDialog}
                      disabled={saving || !allCriteriaEvaluated}
                    >
                      Finalizar Avaliação
                    </Button>
                  </Box>
                </Box>
                
                {!allCriteriaEvaluated && (
                  <FormHelperText error sx={{ mt: 1, textAlign: 'right' }}>
                    Todos os critérios devem ser avaliados antes de finalizar
                  </FormHelperText>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Diálogo de confirmação */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Finalizar Avaliação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja finalizar esta avaliação? Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleFinishEvaluation} color="primary" variant="contained" autoFocus>
            Finalizar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EvaluationPage; 