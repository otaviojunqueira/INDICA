import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Download, 
  ChevronLeft, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageCircle,
  Edit,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

// Tipos simulados (serão substituídos pelos reais da API)
interface Application {
  id: string;
  noticeId: string;
  noticeTitle: string;
  projectTitle: string;
  projectDescription: string;
  entityName: string;
  submittedAt: Date;
  status: 'draft' | 'submitted' | 'under_evaluation' | 'approved' | 'rejected' | 'in_appeal';
  requestedAmount: number;
  category: string;
  formData: {
    [key: string]: any;
  };
  files: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  evaluations?: {
    id: string;
    evaluatorName: string;
    score: number;
    comment: string;
    date: Date;
  }[];
  appealDeadline?: Date;
}

export const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Função para formatar data
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-200 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_evaluation':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_appeal':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para traduzir o status
  const translateStatus = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'submitted':
        return 'Enviado';
      case 'under_evaluation':
        return 'Em Avaliação';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Reprovado';
      case 'in_appeal':
        return 'Em Recurso';
      default:
        return status;
    }
  };

  // Função para obter o ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText size={20} />;
      case 'submitted':
        return <CheckCircle size={20} />;
      case 'under_evaluation':
        return <Clock size={20} />;
      case 'approved':
        return <CheckCircle size={20} />;
      case 'rejected':
        return <XCircle size={20} />;
      case 'in_appeal':
        return <AlertCircle size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  // Efeito para carregar a inscrição
  useEffect(() => {
    // Simulação de chamada à API
    const fetchApplication = async () => {
      setLoading(true);
      try {
        // Em produção, substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados simulados
        const mockApplication: Application = {
          id: id || '1',
          noticeId: '1',
          noticeTitle: 'Edital de Apoio à Cultura 2024',
          projectTitle: 'Festival de Música Independente',
          projectDescription: 'O Festival de Música Independente tem como objetivo promover artistas locais e fomentar a cena musical independente da região. O evento contará com apresentações de 15 bandas e artistas solo durante 3 dias, além de oficinas de produção musical e palestras sobre o mercado da música.',
          entityName: 'Secretaria de Cultura do Estado',
          submittedAt: new Date('2024-03-15'),
          status: 'under_evaluation',
          requestedAmount: 45000,
          category: 'Música',
          formData: {
            targetAudience: 'Público jovem e adulto interessado em música independente, músicos e produtores culturais.',
            expectedResult: 'Realização de 15 shows com público estimado de 2.000 pessoas, 3 oficinas de produção musical com 60 participantes e 2 palestras sobre o mercado musical.',
            executionPeriod: 6,
            culturalArea: 'Música',
          },
          files: [
            {
              id: '1',
              name: 'Portfólio.pdf',
              url: '#',
              type: 'application/pdf'
            },
            {
              id: '2',
              name: 'Planilha Orçamentária.xlsx',
              url: '#',
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            {
              id: '3',
              name: 'Documentos Comprobatórios.zip',
              url: '#',
              type: 'application/zip'
            }
          ],
          evaluations: [
            {
              id: '1',
              evaluatorName: 'Maria Silva',
              score: 85,
              comment: 'Projeto bem estruturado com objetivos claros e viabilidade técnica. Orçamento adequado para as atividades propostas.',
              date: new Date('2024-03-20')
            }
          ],
          appealDeadline: new Date('2024-04-15')
        };

        setApplication(mockApplication);
      } catch (error) {
        console.error('Erro ao carregar inscrição:', error);
        toast.error('Erro ao carregar informações da inscrição.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // Função para lidar com a exclusão da inscrição (apenas para rascunhos)
  const handleDelete = async () => {
    if (!application || application.status !== 'draft') {
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este rascunho? Esta ação não pode ser desfeita.')) {
      try {
        // Em produção, substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success('Rascunho excluído com sucesso!');
        navigate('/applications');
      } catch (error) {
        console.error('Erro ao excluir rascunho:', error);
        toast.error('Erro ao excluir rascunho.');
      }
    }
  };

  // Função para lidar com o envio de recurso
  const handleAppeal = () => {
    if (!application || application.status !== 'rejected') {
      return;
    }

    navigate(`/applications/${id}/appeal`);
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

  if (!application) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Inscrição não encontrada.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Detalhes da Inscrição
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/applications')}
        >
          Voltar para Lista
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {application.projectTitle}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Edital: {application.noticeTitle}
            </Typography>
          </Box>
          <Chip 
            label={translateStatus(application.status)}
            color={getStatusColor(application.status)}
            sx={{ fontSize: '1rem', px: 2, py: 1 }}
          />
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Data de Envio
            </Typography>
            <Typography variant="body1">
              {formatDate(application.submittedAt)} às {new Date(application.submittedAt).toLocaleTimeString('pt-BR')}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Valor Solicitado
            </Typography>
            <Typography variant="body1">
              {formatCurrency(application.requestedAmount)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Categoria
            </Typography>
            <Typography variant="body1">
              {application.category}
            </Typography>
          </Grid>
        </Grid>

        {application.status === 'rejected' && application.appealDeadline && new Date() < application.appealDeadline && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
            onClick={handleAppeal}
            >
              Entrar com Recurso
            </Button>
          </Box>
        )}
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Descrição do Projeto
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" paragraph>
              {application.projectDescription}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Público-alvo
            </Typography>
            <Typography variant="body1" paragraph>
              {application.formData.targetAudience}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Área Cultural
            </Typography>
            <Typography variant="body1" paragraph>
              {application.formData.culturalArea}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Período de Execução
            </Typography>
            <Typography variant="body1" paragraph>
              {application.formData.executionPeriod} meses
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Resultados Esperados
            </Typography>
            <Typography variant="body1" paragraph>
              {application.formData.expectedResult}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Documentos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
            {application.files.map((file) => (
                <ListItem key={file.id} sx={{ py: 1 }}>
                  <ListItemText
                    primary={file.name}
                    secondary={file.type.split('/')[1].toUpperCase()}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    Visualizar
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
          
          {application.evaluations && application.evaluations.length > 0 && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Avaliações
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
                {application.evaluations.map((evaluation) => (
                <Box key={evaluation.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">
                      {evaluation.evaluatorName}
                    </Typography>
                    <Chip 
                      label={translateStatus(evaluation.status)}
                      color={getStatusColor(evaluation.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {formatDate(evaluation.date)}
                  </Typography>
                  
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Typography variant="body2">
                      <strong>Pontuação:</strong> {evaluation.score}/100
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2">
                    <strong>Comentários:</strong>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {evaluation.comment}
                  </Typography>
                  
                  <Divider />
                </Box>
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}; 