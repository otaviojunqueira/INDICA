import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Divider, List, ListItem, ListItemText, Chip, Avatar, Paper, CircularProgress, LinearProgress, IconButton, CardHeader, CardActions, Tooltip, Badge, Alert, AlertTitle } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GroupsIcon from '@mui/icons-material/Groups';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ForumIcon from '@mui/icons-material/Forum';
import TaskIcon from '@mui/icons-material/Task';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import StarIcon from '@mui/icons-material/Star';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SchoolIcon from '@mui/icons-material/School';
import TheatersIcon from '@mui/icons-material/Theaters';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import BrushIcon from '@mui/icons-material/Brush';
import FestivalIcon from '@mui/icons-material/Festival';
import InfoIcon from '@mui/icons-material/Info';
import HistoryIcon from '@mui/icons-material/History';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { UserRole } from '../../types';
import { mockNotices, mockApplications, culturalGroup } from '../../mocks/data';
import { Notice, Application, CulturalGroup } from '../../types';

interface RoleBasedDashboardProps {
  role: UserRole;
  userName: string;
}

// Função para retornar a cor do status
const getStatusColor = (status: string): 'default' | 'info' | 'warning' | 'success' | 'error' => {
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
const getStatusText = (status: string): string => {
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
    case 'open':
      return 'Aberto';
    case 'closed':
      return 'Encerrado';
    case 'evaluation':
      return 'Em Avaliação';
    case 'finished':
      return 'Finalizado';
    default:
      return 'Desconhecido';
  }
};

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ role, userName }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [openNotices, setOpenNotices] = useState<Notice[]>([]);
  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [userGroups, setUserGroups] = useState<CulturalGroup[]>([]);
  const [pendingEvaluations, setPendingEvaluations] = useState(0);

  // Log de depuração detalhado
  console.log('Dados recebidos no RoleBasedDashboard:', { role, userName });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        // Simular carregamento com delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Filtrar editais abertos
        setOpenNotices(mockNotices.filter(notice => notice.status === 'open'));

        // Filtrar inscrições do usuário (para agentes culturais)
        setUserApplications(mockApplications);

        // Filtrar grupos culturais do usuário
        setUserGroups([culturalGroup]);

        // Para avaliadores, contar avaliações pendentes
        if (role === 'evaluator') {
          setPendingEvaluations(5); // Simulando 5 avaliações pendentes
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [role]);

  // Função para renderizar mensagem de erro
  const renderErrorMessage = (message: string) => (
    <Box sx={{ py: 5, textAlign: 'center' }}>
      <Typography variant="h6" color="error">
        {message}
      </Typography>
      <Typography variant="body1">
        Entre em contato com o suporte técnico.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }}
        onClick={() => navigate('/login')}
      >
        Fazer Login Novamente
      </Button>
    </Box>
  );

  // Verificações adicionais de segurança
  if (!role) {
    return renderErrorMessage('Papel do usuário não definido');
  }

  if (!['admin', 'agent', 'evaluator'].includes(role)) {
    return renderErrorMessage(`Tipo de usuário não reconhecido: ${role}`);
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Dashboard para administradores com design atualizado
  const AdminDashboard = () => {
    // Obter horário do dia para saudação personalizada
    const currentHour = new Date().getHours();
    let greeting;
    
    if (currentHour < 12) {
      greeting = "Bom dia";
    } else if (currentHour < 18) {
      greeting = "Boa tarde";
    } else {
      greeting = "Boa noite";
    }
    
    // Dados fictícios para o gráfico de inscrições
    const inscricoesRegionais = {
      norte: 15,
      nordeste: 38,
      centrooeste: 22,
      sudeste: 45,
      sul: 30
    };
    
    // Tarefas pendentes
    const tarefasPendentes = [
      { id: 1, titulo: "Avaliar inscrições do Edital de Fomento à Música", prazo: "Hoje", urgencia: "alta" },
      { id: 2, titulo: "Revisar relatório trimestral", prazo: "Amanhã", urgencia: "media" },
      { id: 3, titulo: "Preparar novo edital de apoio às artes visuais", prazo: "3 dias", urgencia: "baixa" }
    ];
    
    // Atividades recentes
    const atividadesRecentes = [
      { id: 1, acao: "Novo cadastro de agente cultural", tempo: "2 horas atrás", tipo: "info" },
      { id: 2, acao: "Inscrição finalizada no Edital de Fomento à Música", tempo: "1 dia atrás", tipo: "success" },
      { id: 3, acao: "Avaliação pendente com prazo expirado", tempo: "2 dias atrás", tipo: "warning" }
    ];
    
    // Função para obter cor com base na urgência
    const getUrgenciaColor = (urgencia: string) => {
      switch(urgencia) {
        case 'alta': return 'error';
        case 'media': return 'warning';
        case 'baixa': return 'info';
        default: return 'default';
      }
    };
    
    // Função para obter ícone com base no tipo de atividade
    const getAtividadeIcon = (tipo: string) => {
      switch(tipo) {
        case 'success': return <CheckCircleIcon color="success" />;
        case 'warning': return <PriorityHighIcon color="warning" />;
        case 'info': return <ForumIcon color="info" />;
        default: return null;
      }
    };

    return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
        {/* Cabeçalho personalizado */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          borderRadius: 2,
          backgroundImage: 'linear-gradient(135deg, #3f51b5 0%, #7986cb 100%)',
          color: 'white'
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              {greeting}, Admin!
            </Typography>
            <Typography variant="subtitle1">
              Gerencie editais, inscrições e avaliações.
            </Typography>
          </Box>
          <Avatar 
            sx={{ width: 64, height: 64, bgcolor: 'primary.light', border: '3px solid white' }}
            alt="Admin"
          >
            A
          </Avatar>
        </Box>
      
        {/* Cartões com estatísticas mais visuais */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }
            }}>
              <CardHeader
                avatar={<AssignmentIcon color="primary" fontSize="large" />}
                title="Editais"
                titleTypographyProps={{ variant: 'h6' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {mockNotices.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 1 }}>
                    total
                  </Typography>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Editais abertos: {openNotices.length} de {mockNotices.length} ({Math.round((openNotices.length/mockNotices.length)*100)}%)
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(openNotices.length/mockNotices.length)*100}
                    sx={{ height: 8, borderRadius: 5 }} 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<EditIcon />}
                    component={RouterLink}
                    to="/admin/create-notice"
                    sx={{ borderRadius: 2 }}
                  >
                    Novo Edital
                  </Button>
                  <Button
                    variant="text"
                    component={RouterLink}
                    to="/notices"
                  >
                    Ver Todos
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }
            }}>
              <CardHeader
                avatar={<InsertDriveFileIcon color="primary" fontSize="large" />}
                title="Inscrições"
                titleTypographyProps={{ variant: 'h6' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    24
                  </Typography>
                  <Typography variant="caption" sx={{ mb: 1, ml: 1, display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                    +12% esta semana
                  </Typography>
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    8 inscrições nos últimos 7 dias
                  </Typography>
                  
                  {/* Mini-gráfico de inscrições por região */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 40, mt: 2 }}>
                    {Object.entries(inscricoesRegionais).map(([regiao, valor], index) => (
                      <Box 
                        key={regiao}
                        sx={{ 
                          height: `${(valor/45)*100}%`, 
                          width: '18%',
                          backgroundColor: `primary.${index % 2 ? 'light' : 'main'}`,
                          mx: 0.5,
                          borderTopLeftRadius: 2,
                          borderTopRightRadius: 2
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption">N</Typography>
                    <Typography variant="caption">NE</Typography>
                    <Typography variant="caption">CO</Typography>
                    <Typography variant="caption">SE</Typography>
                    <Typography variant="caption">S</Typography>
                  </Box>
                </Box>
                <Button 
                  variant="contained"
                  color="primary"
                  fullWidth
                  component={RouterLink}
                  to="/applications"
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Ver Inscrições
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }
            }}>
              <CardHeader
                avatar={<BarChartIcon color="primary" fontSize="large" />}
                title="Relatórios"
                titleTypographyProps={{ variant: 'h6' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    5
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 1 }}>
                    relatórios disponíveis
                  </Typography>
                </Box>
                <List dense sx={{ mb: 1 }}>
                  <ListItem disablePadding>
                    <ListItemText primary="Relatório de inscrições por estado" />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText primary="Análise de distribuição de recursos" />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText primary="Estatísticas de aprovação" />
                  </ListItem>
                </List>
                <Button 
                  variant="contained"
                  color="primary"
                  fullWidth
                  component={RouterLink}
                  to="/admin/reports"
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Gerar Relatórios
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      
        {/* Grid de dois painéis principais - Editais e atividades recentes */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Edital em destaque */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <CardHeader
                title="Editais Recentes"
                action={
                  <Button 
                    variant="text" 
                    component={RouterLink}
                    to="/notices"
                    sx={{ fontSize: 14 }}
                  >
                    Ver Todos
                  </Button>
                }
              />
              <Divider />
              
              <List sx={{ pt: 0 }}>
                {mockNotices.slice(0, 4).map((notice) => (
                  <React.Fragment key={notice.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ py: 2 }}
                      secondaryAction={
                        <IconButton 
                          size="small" 
                          component={RouterLink} 
                          to={`/notice/${notice.id}`}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box 
                          sx={{ 
                            width: 4, 
                            backgroundColor: notice.status === 'open' ? 'success.main' : 'text.disabled',
                            borderRadius: 5,
                            mr: 2
                          }} 
                        />
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {notice.title}
                            </Typography>
                            <Chip 
                              label={getStatusText(notice.status)}
                              color={getStatusColor(notice.status) as any}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Prazo: {new Date(notice.endDate).toLocaleDateString('pt-BR')}
                            </Typography>
                          </Box>
                          
                          {/* Barra de progresso de inscrições */}
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Inscrições: {Math.floor(Math.random() * 20) + 5} recebidas
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {Math.floor(Math.random() * 80) + 20}% da meta
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={Math.floor(Math.random() * 80) + 20} 
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </Grid>
          
          {/* Resumo de atividades recentes */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3} direction="column">
              {/* Atividades recentes */}
              <Grid item>
                <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardHeader
                    title="Atividades Recentes"
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <Divider />
                  <List dense>
                    {atividadesRecentes.map(atividade => (
                      <ListItem
                        key={atividade.id}
                        sx={{ py: 1.5 }}
                      >
                        <Box sx={{ mr: 1.5 }}>
                          {getAtividadeIcon(atividade.tipo)}
                        </Box>
                        <ListItemText 
                          primary={atividade.acao} 
                          secondary={atividade.tempo}
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
              
              {/* Tarefas pendentes */}
              <Grid item>
                <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardHeader
                    title="Tarefas Pendentes"
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <Divider />
                  <List dense>
                    {tarefasPendentes.map(tarefa => (
                      <ListItem
                        key={tarefa.id}
                        secondaryAction={
                          <Chip 
                            label={tarefa.prazo} 
                            color={getUrgenciaColor(tarefa.urgencia) as any}
                            size="small" 
                          />
                        }
                        sx={{ py: 1 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TaskIcon sx={{ mr: 1.5 }} color="primary" />
                          <ListItemText primary={tarefa.titulo} />
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                  <CardActions>
                    <Button color="primary" fullWidth>Ver Todas as Tarefas</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Footer informativo */}
        <Paper sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: 'rgba(0,0,0,0.02)',
          mt: 3
        }}>
          <Typography variant="body2" color="text.secondary">
            <strong>INDICA</strong> — Sistema de Indicadores Culturais | Versão 1.2.0
          </Typography>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total de usuários: 148 | Grupos Culturais: 32 | Eventos cadastrados: 17
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  };

  // Dashboard para agentes culturais com design atualizado
  const AgentDashboard = () => {
    // Obter horário do dia para saudação personalizada
    const currentHour = new Date().getHours();
    let greeting;
    
    if (currentHour < 12) {
      greeting = "Bom dia";
    } else if (currentHour < 18) {
      greeting = "Boa tarde";
    } else {
      greeting = "Boa noite";
    }
    
    // Cálculo fictício da completude do perfil
    const profileCompletion = 65;
    
    // Dados fictícios para estatísticas
    const estatisticasPerfil = {
      inscricoesAprovadas: 7,
      inscricoesTotal: 12,
      valorTotalAprovado: 'R$ 45.000,00',
      categoriasFrequentes: ['Música', 'Artes Visuais', 'Literatura']
    };
    
    // Notificações e alertas
    const notificacoes = [
      { 
        id: 1, 
        titulo: 'Documentação pendente', 
        mensagem: 'Complete sua documentação para o Edital de Música',
        tipo: 'warning',
        tempo: '3 dias atrás'
      },
      { 
        id: 2, 
        titulo: 'Projeto aprovado', 
        mensagem: 'Seu projeto "Festival de Artes Integradas" foi aprovado',
        tipo: 'success',
        tempo: '1 semana atrás'
      },
      { 
        id: 3, 
        titulo: 'Novo edital disponível', 
        mensagem: 'Edital de incentivo à literatura aberto',
        tipo: 'info',
        tempo: 'hoje'
      }
    ];
    
    // Obter ícone por categoria cultural
    const getCategoriaIcon = (categoria: string) => {
      switch(categoria.toLowerCase()) {
        case 'música':
          return <MusicNoteIcon />;
        case 'artes visuais':
          return <BrushIcon />;
        case 'teatro':
          return <TheatersIcon />;
        case 'literatura':
          return <ArticleIcon />;
        case 'dança':
          return <FestivalIcon />;
        default:
          return <LocalOfferIcon />;
      }
    };
    
    // Obter ícone e cor baseados no tipo de notificação
    const getNotificationIcon = (tipo: string) => {
      switch(tipo) {
        case 'success':
          return <CheckCircleIcon color="success" />;
        case 'warning':
          return <PriorityHighIcon color="warning" />;
        case 'info':
          return <InfoIcon color="info" />;
        default:
          return <NotificationsIcon color="primary" />;
      }
    };
    
    // Formatar dias restantes
    const getDiasRestantes = (endDate: string) => {
      const end = new Date(endDate);
      const hoje = new Date();
      const diffTime = end.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'Encerrado';
      if (diffDays === 0) return 'Último dia!';
      if (diffDays === 1) return '1 dia restante';
      return `${diffDays} dias restantes`;
    };
    
    // Calcular porcentagem de compatibilidade fictícia
    const getCompatibilidade = (noticeId: string) => {
      // Números aleatórios para demonstração
      const valor = Math.floor(Math.random() * 31) + 70; // Número entre 70-100
      return valor;
    };

    return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
        {/* Cabeçalho personalizado */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          borderRadius: 2,
          backgroundImage: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)',
          color: 'white'
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              {greeting}, {userName}!
            </Typography>
            <Typography variant="subtitle1">
              Bem-vindo ao seu espaço de agente cultural.
            </Typography>
          </Box>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Avatar 
                sx={{ 
                  width: 22, 
                  height: 22, 
                  bgcolor: profileCompletion > 80 ? 'success.main' : 'warning.main',
                  border: '2px solid white',
                }}
              >
                <Typography variant="caption" color="white">
                  {profileCompletion}%
                </Typography>
              </Avatar>
            }
          >
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64,
                bgcolor: 'primary.light',
                border: '3px solid white'
              }}
            >
              {userName.charAt(0)}
            </Avatar>
          </Badge>
        </Box>
        
        {/* Painel de Status do Perfil */}
        <Alert 
          severity={profileCompletion >= 80 ? "success" : "warning"}
          variant="outlined"
          sx={{ mb: 4, borderRadius: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<EditIcon />}
              component={RouterLink}
              to="/profile"
            >
              Completar
            </Button>
          }
        >
          <AlertTitle>Status do seu perfil</AlertTitle>
          <Box sx={{ mt: 1, mb: 1 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {profileCompletion >= 80 
                ? 'Seu perfil está quase completo! Continue adicionando informações para aumentar suas chances em editais.'
                : 'Complete seu perfil para aumentar suas chances de aprovação em editais.'}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={profileCompletion} 
              sx={{ 
                height: 8, 
                borderRadius: 5,
                mb: 1,
                bgcolor: 'rgba(0,0,0,0.1)',
              }} 
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Pendentes: Comprovante de residência, Portfólio cultural
          </Typography>
        </Alert>
      
        {/* Cards principais - Estatísticas e acesso rápido */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }
            }}>
              <CardHeader
                avatar={<InsertDriveFileIcon color="primary" fontSize="large" />}
                title="Minhas Inscrições"
                titleTypographyProps={{ variant: 'h6' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {mockApplications.length}
                  </Typography>
                  <Box sx={{ ml: 2, mb: 0.5 }}>
                    <Chip 
                      size="small" 
                      icon={<AccessTimeIcon />} 
                      label={`${mockApplications.filter(app => app.status === 'under_review').length} em análise`}
                      color="info"
                      sx={{ mb: 1 }}
                    />
                    <br />
                    <Chip 
                      size="small" 
                      icon={<CheckCircleIcon />} 
                      label={`${mockApplications.filter(app => app.status === 'approved').length} aprovadas`}
                      color="success"
                    />
                  </Box>
                </Box>
                
                {/* Visual de progresso de suas inscrições */}
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Box sx={{ display: 'flex', mb: 0.5, justifyContent: 'space-between' }}>
                    <Typography variant="caption" fontWeight="medium">Status das inscrições</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', height: 8, mb: 1 }}>
                    <Tooltip title={`${mockApplications.filter(app => app.status === 'approved').length} aprovadas`}>
                      <Box sx={{ bgcolor: 'success.main', width: `${mockApplications.filter(app => app.status === 'approved').length/mockApplications.length*100}%`, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }} />
                    </Tooltip>
                    <Tooltip title={`${mockApplications.filter(app => app.status === 'under_review').length} em análise`}>
                      <Box sx={{ bgcolor: 'info.main', width: `${mockApplications.filter(app => app.status === 'under_review').length/mockApplications.length*100}%` }} />
                    </Tooltip>
                    <Tooltip title={`${mockApplications.filter(app => app.status === 'pending_adjustment').length} pendentes de ajuste`}>
                      <Box sx={{ bgcolor: 'warning.main', width: `${mockApplications.filter(app => app.status === 'pending_adjustment').length/mockApplications.length*100}%` }} />
                    </Tooltip>
                    <Tooltip title={`${mockApplications.filter(app => app.status === 'rejected').length} rejeitadas`}>
                      <Box sx={{ bgcolor: 'error.main', width: `${mockApplications.filter(app => app.status === 'rejected').length/mockApplications.length*100}%`, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
                    </Tooltip>
                  </Box>
                </Box>
                
                <Button 
                  variant="contained"
                  color="primary"
                  fullWidth
                  component={RouterLink}
                  to="/applications"
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Gerenciar Inscrições
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }
            }}>
              <CardHeader
                avatar={<AssignmentIcon color="primary" fontSize="large" />}
                title="Editais Disponíveis"
                titleTypographyProps={{ variant: 'h6' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {openNotices.length}
                  </Typography>
                  <Box sx={{ ml: 2, mb: 0.5 }}>
                    <Chip 
                      size="small"
                      icon={<NewReleasesIcon />}
                      label="Novos editais"
                      color="secondary"
                    />
                  </Box>
                </Box>
                
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Editais com maior compatibilidade com seu perfil:
                  </Typography>
                  
                  {/* Lista de editais recomendados */}
                  {openNotices.slice(0, 2).map(notice => (
                    <Box 
                      key={notice.id} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 1, 
                        p: 1, 
                        borderRadius: 1,
                        bgcolor: 'rgba(0,0,0,0.03)'
                      }}
                    >
                      <Typography variant="body2" noWrap sx={{ width: '70%', fontWeight: 'medium' }}>
                        {notice.title}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={`${getCompatibilidade(notice.id)}% compatível`}
                        color={getCompatibilidade(notice.id) > 85 ? "success" : "default"}
                        sx={{ height: 20 }}
                      />
                    </Box>
                  ))}
                </Box>
                
                <Button 
                  variant="contained"
                  color="primary"
                  fullWidth
                  component={RouterLink}
                  to="/notices"
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Explorar Editais
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }
            }}>
              <CardHeader
                avatar={<GroupsIcon color="primary" fontSize="large" />}
                title="Meus Coletivos"
                titleTypographyProps={{ variant: 'h6' }}
                sx={{ pb: 0 }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {userGroups.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, ml: 1 }}>
                    coletivos cadastrados
                  </Typography>
                </Box>
                
                {/* Lista de coletivos */}
                {userGroups.map(group => (
                  <Box 
                    key={group.id} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1,
                      mb: 1,
                      borderRadius: 1,
                      bgcolor: 'rgba(0,0,0,0.03)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }}>
                        {group.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {group.name}
                      </Typography>
                    </Box>
                    <Chip 
                      size="small" 
                      label={group.verified ? "Verificado" : "Pendente"} 
                      color={group.verified ? "success" : "warning"} 
                      sx={{ height: 20 }}
                    />
                  </Box>
                ))}
                
                <Button 
                  variant="contained"
                  color="primary"
                  fullWidth
                  component={RouterLink}
                  to="/cultural-groups"
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Gerenciar Coletivos
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      
        {/* Seção de inscrições e editais recomendados */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Minhas inscrições recentes */}
          <Grid item xs={12} md={7}>
            <Card sx={{ 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <CardHeader
                title="Minhas Inscrições em Andamento"
                action={
                  <Button 
                    variant="text" 
                    component={RouterLink}
                    to="/applications"
                    sx={{ fontSize: 14 }}
                  >
                    Ver Todas
                  </Button>
                }
              />
              <Divider />
              
              {mockApplications.length > 0 ? (
                <List sx={{ pt: 0 }}>
                  {mockApplications.slice(0, 3).map((application) => (
                    <React.Fragment key={application.id}>
                      <ListItem 
                        alignItems="flex-start"
                        sx={{ py: 2 }}
                        secondaryAction={
                          <Box>
                            <Chip 
                              label={getStatusText(application.status)}
                              color={getStatusColor(application.status) as any}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <IconButton 
                              size="small" 
                              component={RouterLink} 
                              to={`/application/${application.id}`}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        }
                      >
                        <Box sx={{ display: 'flex', width: '100%' }}>
                          <Box 
                            sx={{ 
                              width: 4, 
                              backgroundColor: getStatusColor(application.status),
                              borderRadius: 5,
                              mr: 2
                            }} 
                          />
                          <Box sx={{ width: '100%' }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {application.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Edital: {application.noticeTitle}
                            </Typography>
                            
                            {/* Barra de progresso da inscrição */}
                            <Box sx={{ mt: 1.5, mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Progresso da inscrição:
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={application.status === 'draft' ? 30 : application.status === 'under_review' ? 70 : application.status === 'approved' ? 100 : 50} 
                                sx={{ height: 6, mt: 0.5, borderRadius: 3 }}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                Último acesso: {new Date().toLocaleDateString('pt-BR')}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Você ainda não possui inscrições em editais.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    component={RouterLink}
                    to="/notices"
                  >
                    Explorar Editais Disponíveis
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
          
          {/* Painel lateral com notificações e estatísticas */}
          <Grid item xs={12} md={5}>
            <Grid container spacing={3} direction="column">
              {/* Notificações */}
              <Grid item>
                <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardHeader
                    title="Notificações"
                    titleTypographyProps={{ variant: 'h6' }}
                    action={
                      <Badge badgeContent={notificacoes.length} color="error">
                        <NotificationsIcon />
                      </Badge>
                    }
                  />
                  <Divider />
                  <List dense>
                    {notificacoes.map(notificacao => (
                      <ListItem
                        key={notificacao.id}
                        sx={{ py: 1.5 }}
                      >
                        <Box sx={{ mr: 1.5 }}>
                          {getNotificationIcon(notificacao.tipo)}
                        </Box>
                        <ListItemText 
                          primary={notificacao.titulo} 
                          secondary={
                            <React.Fragment>
                              {notificacao.mensagem}
                              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                {notificacao.tempo}
                              </Typography>
                            </React.Fragment>
                          }
                          primaryTypographyProps={{ fontWeight: 'medium' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
              
              {/* Estatísticas Pessoais */}
              <Grid item>
                <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardHeader
                    title="Minhas Estatísticas"
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                  <Divider />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          {estatisticasPerfil.inscricoesAprovadas}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Projetos<br />Aprovados
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                          {Math.round((estatisticasPerfil.inscricoesAprovadas/estatisticasPerfil.inscricoesTotal)*100)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Taxa de<br />Aprovação
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" fontWeight="medium" color="secondary.main">
                          {estatisticasPerfil.valorTotalAprovado}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Valor Total<br />Aprovado
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                      Categorias mais frequentes:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {estatisticasPerfil.categoriasFrequentes.map((categoria, index) => (
                        <Chip 
                          key={index}
                          icon={getCategoriaIcon(categoria)}
                          label={categoria}
                          size="small"
                          variant="outlined"
                          color={index === 0 ? "primary" : "default"}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Editais recomendados */}
        <Card sx={{ mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardHeader
            title="Editais Recomendados para Você"
            titleTypographyProps={{ variant: 'h6' }}
            subheader="Baseado no seu perfil e áreas de interesse"
          />
          <Divider />
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {openNotices.slice(0, 3).map(notice => (
                <Grid item xs={12} md={4} key={notice.id}>
                  <Card variant="outlined">
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {notice.title}
                        </Typography>
                        <Chip 
                          label={`${getCompatibilidade(notice.id)}%`}
                          color={getCompatibilidade(notice.id) > 85 ? "success" : "default"}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: getDiasRestantes(notice.endDate).includes('Encerrado') ? 'error.main' : 'text.secondary' }} />
                        <Typography 
                          variant="body2" 
                          color={getDiasRestantes(notice.endDate).includes('Encerrado') ? 'error.main' : getDiasRestantes(notice.endDate).includes('dia') ? 'warning.main' : 'text.secondary'}
                          fontWeight={getDiasRestantes(notice.endDate).includes('dia') ? 'bold' : 'regular'}
                        >
                          {getDiasRestantes(notice.endDate)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        {notice.categories?.map((category, index) => (
                          <Chip
                            key={index}
                            label={category}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        component={RouterLink}
                        to={`/notice/${notice.id}`}
                      >
                        Ver detalhes
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to={`/application/new?editalId=${notice.id}`}
                      >
                        Inscrever-se
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
        
        {/* Footer informativo */}
        <Paper sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: 'rgba(0,0,0,0.02)',
          mt: 3
        }}>
          <Typography variant="body2" color="text.secondary">
            <strong>INDICA</strong> — Sistema de Indicadores Culturais | Acesso Agente Cultural
          </Typography>
          <Box>
            <Button 
              size="small" 
              startIcon={<SchoolIcon />} 
              component={RouterLink} 
              to="/training"
              sx={{ mr: 1 }}
            >
              Capacitação
            </Button>
            <Button 
              size="small" 
              startIcon={<InfoIcon />} 
              component={RouterLink} 
              to="/help"
            >
              Ajuda
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  // Dashboard para avaliadores (pareceristas)
  const EvaluatorDashboard = () => {
    // Obter horário do dia para saudação personalizada
    const currentHour = new Date().getHours();
    let greeting;
    
    if (currentHour < 12) {
      greeting = "Bom dia";
    } else if (currentHour < 18) {
      greeting = "Boa tarde";
    } else {
      greeting = "Boa noite";
    }

    return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
        {/* Cabeçalho personalizado */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          borderRadius: 2,
          backgroundImage: 'linear-gradient(135deg, #673ab7 0%, #9c27b0 100%)',
          color: 'white'
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              {greeting}, Parecerista!
            </Typography>
            <Typography variant="subtitle1">
              Gerencie suas avaliações de projetos culturais.
            </Typography>
          </Box>
          <Avatar 
            sx={{ width: 64, height: 64, bgcolor: 'secondary.light', border: '3px solid white' }}
            alt="Parecerista"
          >
            P
          </Avatar>
        </Box>
      
        {/* Cartões com estatísticas e acesso rápido */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' },
              boxShadow: 3
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon color="primary" fontSize="large" sx={{ mr: 1 }} />
                  <Typography variant="h6">Avaliações Pendentes</Typography>
                </Box>
                <Typography variant="h3" color="primary" sx={{ mb: 1 }}>{pendingEvaluations}</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Inscrições aguardando sua avaliação
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={pendingEvaluations > 0 ? 100 : 0} 
                  color={pendingEvaluations > 3 ? "error" : "primary"}
                  sx={{ mb: 2, height: 8, borderRadius: 2 }}
                />
              </CardContent>
              <CardActions>
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  size="large"
                  component={RouterLink}
                  to="/evaluator/projects"
                  startIcon={<AssignmentIcon />}
                >
                  Avaliar Projetos
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' },
              boxShadow: 3
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon color="info" fontSize="large" sx={{ mr: 1 }} />
                  <Typography variant="h6">Histórico de Avaliações</Typography>
                </Box>
                <Typography variant="h3" color="info.main" sx={{ mb: 1 }}>12</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Avaliações realizadas até o momento
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="success.main">Aprovados: 8</Typography>
                  <Typography variant="caption" color="error.main">Reprovados: 2</Typography>
                  <Typography variant="caption" color="warning.main">Ajustes: 2</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  color="info"
                  sx={{ mb: 2, height: 8, borderRadius: 2 }}
                />
              </CardContent>
              <CardActions>
                <Button 
                  variant="outlined" 
                  color="info"
                  fullWidth
                  size="large"
                  component={RouterLink}
                  to="/evaluator/history"
                  startIcon={<HistoryIcon />}
                >
                  Ver Histórico
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)' },
              boxShadow: 3
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MenuBookIcon color="secondary" fontSize="large" sx={{ mr: 1 }} />
                  <Typography variant="h6">Recursos e Materiais</Typography>
                </Box>
                <Typography variant="h3" color="secondary.main" sx={{ mb: 1 }}>8</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Documentos e guias disponíveis para consulta
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  <Chip label="Manuais" size="small" />
                  <Chip label="Critérios" size="small" />
                  <Chip label="Tutoriais" size="small" />
                  <Chip label="FAQ" size="small" />
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  fullWidth
                  size="large"
                  component={RouterLink}
                  to="/evaluator/resources"
                  startIcon={<MenuBookIcon />}
                >
                  Acessar Recursos
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        
        {/* Projetos para avaliar */}
        <Card sx={{ mb: 4 }}>
          <CardHeader 
            title="Projetos Aguardando Avaliação" 
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <Button 
                variant="text" 
                color="primary"
                component={RouterLink}
                to="/evaluator/projects"
              >
                Ver Todos
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <List>
              {pendingEvaluations > 0 ? (
                Array.from({ length: Math.min(pendingEvaluations, 3) }).map((_, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      borderLeft: '4px solid', 
                      borderColor: index === 0 ? 'error.main' : index === 1 ? 'warning.main' : 'info.main',
                      mb: 1,
                      bgcolor: 'background.paper',
                      borderRadius: '0 4px 4px 0',
                      boxShadow: 1
                    }}
                    secondaryAction={
                      <Button 
                        variant="contained" 
                        size="small"
                        component={RouterLink}
                        to={`/evaluator/evaluation/${index + 1}`}
                      >
                        Avaliar
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={`Projeto ${index + 1}: ${['Festival de Música Independente', 'Exposição de Arte Contemporânea', 'Oficina de Teatro para Jovens'][index]}`}
                      secondary={`Prazo: ${['2 dias', '5 dias', '1 semana'][index]} • Prioridade: ${['Alta', 'Média', 'Baixa'][index]}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Box sx={{ py: 2, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    Não há projetos aguardando avaliação no momento.
                  </Typography>
                </Box>
              )}
            </List>
          </CardContent>
        </Card>
        
        {/* Recursos em destaque */}
        <Card>
          <CardHeader 
            title="Recursos em Destaque" 
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <Button 
                variant="text" 
                color="primary"
                component={RouterLink}
                to="/evaluator/resources"
              >
                Ver Biblioteca
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
                  <DescriptionIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">Manual do Avaliador</Typography>
                    <Typography variant="body2" color="text.secondary">Guia completo com diretrizes e critérios</Typography>
                    <Button size="small" sx={{ mt: 1 }} component={RouterLink} to="/evaluator/resources">Acessar</Button>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
                  <VideoLibraryIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">Tutorial em Vídeo</Typography>
                    <Typography variant="body2" color="text.secondary">Como avaliar projetos no INDICA</Typography>
                    <Button size="small" sx={{ mt: 1 }} component={RouterLink} to="/evaluator/resources">Assistir</Button>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
                  <HelpOutlineIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">Perguntas Frequentes</Typography>
                    <Typography variant="body2" color="text.secondary">Dúvidas comuns sobre avaliação</Typography>
                    <Button size="small" sx={{ mt: 1 }} component={RouterLink} to="/evaluator/resources">Consultar</Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        {/* Footer informativo */}
        <Paper sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: 'rgba(0,0,0,0.02)',
          mt: 3
        }}>
          <Typography variant="body2" color="text.secondary">
            <strong>INDICA</strong> — Sistema de Indicadores Culturais | Acesso Parecerista
          </Typography>
          <Box>
            <Button 
              size="small" 
              startIcon={<ForumIcon />} 
              component={RouterLink} 
              to="/evaluator/resources"
              sx={{ mr: 1 }}
            >
              Fórum de Pareceristas
            </Button>
            <Button 
              size="small" 
              startIcon={<InfoIcon />} 
              component={RouterLink} 
              to="/help"
            >
              Ajuda
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  // Renderizar dashboard específico para cada tipo de usuário
  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'agent':
      return <AgentDashboard />;
    case 'evaluator':
      return <EvaluatorDashboard />;
    default:
      return renderErrorMessage(`Papel do usuário não suportado: ${role}`);
  }
}; 

export default RoleBasedDashboard;