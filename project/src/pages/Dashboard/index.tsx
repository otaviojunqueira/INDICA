import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Avatar
} from '@mui/material';
import {
  Person,
  LibraryBooks,
  Group,
  Description,
  Notifications,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import RoleBasedDashboard from '../../components/Dashboard/RoleBasedDashboard';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  read: boolean;
  date: Date;
  type: string;
}

// Lista de emails permitidos para super admins
const SUPER_ADMIN_EMAILS = [
  'admin1@indica.com.br',
  'admin2@indica.com.br'
];

// Esta é a página principal do Dashboard que exibirá conteúdo diferente baseado no papel do usuário
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [notifications] = useState<Notification[]>([
    { id: '1', title: 'Novo edital disponível', read: false, date: new Date(), type: 'info' },
    { id: '2', title: 'Seu perfil está incompleto', read: false, date: new Date(), type: 'warning' },
    { id: '3', title: 'Inscrição enviada com sucesso', read: true, date: new Date(), type: 'success' }
  ]);
  const [activeNotices, setActiveNotices] = useState<number>(0);
  const [myApplications, setMyApplications] = useState<number>(0);
  const [pendingEvaluations, setPendingEvaluations] = useState<number>(0);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  useEffect(() => {
    // Redirecionar se não estiver autenticado
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Aqui você carregaria dados do servidor
    // Vamos simular com um timeout
    setTimeout(() => {
      setActiveNotices(8);
      setMyApplications(3);
      setNotifications([
        { id: '1', title: 'Sua inscrição foi recebida', type: 'success', date: new Date() },
        { id: '2', title: 'Novo edital disponível', type: 'info', date: new Date() },
        { id: '3', title: 'Prazo de inscrição expirando', type: 'warning', date: new Date() }
      ]);
      setPendingEvaluations(5);
      setDataLoading(false);
    }, 1500);
  }, []);

  // Função para navegar para diferentes seções
  const navigateTo = (path: string) => () => {
    navigate(path);
  };

  // Traduzir o papel do usuário para português
  const translateRole = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'evaluator':
        return 'Avaliador';
      case 'agent':
        return 'Agente Cultural';
      default:
        return 'Usuário';
    }
  };

  // Verificação detalhada do usuário
  console.group('Informações do Usuário');
  console.log('Usuário:', JSON.stringify(user, null, 2));
  console.log('Autenticado:', isAuthenticated);
  console.log('Carregando:', isLoading);
  console.log('Tipo de usuário:', typeof user);
  console.log('Propriedades do usuário:', user ? Object.keys(user) : 'Sem usuário');
  console.groupEnd();

  // Verificar se o usuário é um super admin
  const isSuperAdmin = user?.role === 'admin' && user?.email && SUPER_ADMIN_EMAILS.includes(user.email);

  // Redirecionar super admin para a página de gerenciamento de entidades
  useEffect(() => {
    if (isAuthenticated && isSuperAdmin) {
      console.log('Dashboard: Redirecionando super admin para gerenciamento de entidades');
      navigate('/admin/entities');
    }
  }, [isAuthenticated, isSuperAdmin, navigate]);

  // Se estiver carregando, mostrar indicador de progresso
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Se não houver usuário autenticado, não renderizar nada
  if (!user || !isAuthenticated) {
    console.error('Usuário não autenticado:', { user, isAuthenticated });
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">
          Usuário não autenticado. Por favor, faça login novamente.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/login')}
          sx={{ ml: 2 }}
        >
          Fazer Login
        </Button>
      </Box>
    );
  }

  console.log('Usuário no Dashboard:', { 
    name: user.name, 
    role: user.role, 
    id: user.id 
  });

  const getIconByType = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon color="success" />;
      case 'info': return <InfoIcon color="info" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return <InfoIcon color="info" />;
    }
  };

  // Conteúdo específico baseado no papel do usuário
  let roleSpecificContent;

  if (user.role === 'admin') {
    roleSpecificContent = (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Gerenciamento de Editais" />
            <Divider />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/admin/create-notice"
                  startIcon={<DescriptionIcon />}
                >
                  Criar Novo Edital
                </Button>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/admin/notices"
                  startIcon={<AssignmentIcon />}
                >
                  Gerenciar Editais
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Relatórios e Estatísticas" />
            <Divider />
            <CardContent>
              <Typography paragraph>
                Acesse relatórios detalhados sobre inscrições, avaliações e distribuição de recursos.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/admin/reports"
              >
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  } else if (user.role === 'agent') {
    roleSpecificContent = (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Minhas Inscrições" 
              subheader={`Você tem ${myApplications} inscrições`}
            />
            <Divider />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/applications"
                >
                  Ver Minhas Inscrições
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Meu Perfil Cultural" 
              action={
                <Chip 
                  label="Incompleto" 
                  color="warning" 
                  size="small" 
                />
              }
            />
            <Divider />
            <CardContent>
              <Typography paragraph>
                Complete seu perfil para aumentar suas chances de aprovação nos editais.
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/profile"
              >
                Completar Perfil
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  } else if (user.role === 'evaluator') {
    roleSpecificContent = (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Avaliações Pendentes" 
              subheader={`${pendingEvaluations} avaliações aguardando`}
            />
            <Divider />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/evaluator/evaluations"
                  color="primary"
                >
                  Continuar Avaliações
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Cabeçalho de boas-vindas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" component="h1" gutterBottom>
                Olá, {user.name}
              </Typography>
              <Chip
                label={translateRole(user.role)}
                color={user.role === 'admin' ? 'secondary' : user.role === 'evaluator' ? 'primary' : 'success'}
              />
            </Box>
            <Typography variant="body1">
              Bem-vindo ao seu painel de controle do Sistema INDICA. Aqui você pode gerenciar seu
              perfil, inscrições, e acompanhar todas as atividades relacionadas à gestão cultural.
            </Typography>
          </Paper>
        </Grid>

        {/* Dashboard específico por papel */}
        <Grid item xs={12}>
          <RoleBasedDashboard role={user.role} userName={user.name} />
        </Grid>

        {/* Seção de notificações recentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Notificações Recentes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ overflow: 'auto', flex: 1 }}>
              {notifications.map((notification) => (
                <ListItem key={notification.id} button>
                  <ListItemIcon>
                    {getIconByType(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={notification.date.toLocaleDateString('pt-BR')}
                  />
                  {!notification.read && (
                    <Chip label="Nova" size="small" color="primary" />
                  )}
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 1 }}>
              <Button onClick={navigateTo('/notifications')} size="small" color="primary">
                Ver Todas
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Ações rápidas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Ações Rápidas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Person />}
                  onClick={navigateTo('/agent-profile')}
                >
                  Meu Perfil
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<LibraryBooks />}
                  onClick={navigateTo('/notices')}
                >
                  Editais
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Group />}
                  onClick={navigateTo('/cultural-group')}
                >
                  Meus Coletivos
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Description />}
                  onClick={navigateTo('/applications')}
                >
                  Minhas Inscrições
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Conteúdo específico de role */}
        <Grid item xs={12}>
          {roleSpecificContent}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 