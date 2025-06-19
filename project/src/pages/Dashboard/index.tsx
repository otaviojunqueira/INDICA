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
  CircularProgress
} from '@mui/material';
import {
  Person,
  LibraryBooks,
  Group,
  Description,
  Notifications
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { RoleBasedDashboard } from '../../components/Dashboard/RoleBasedDashboard';

interface Notification {
  id: string;
  title: string;
  read: boolean;
  date: Date;
}

// Esta é a página principal do Dashboard que exibirá conteúdo diferente baseado no papel do usuário
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [notifications] = useState<Notification[]>([
    { id: '1', title: 'Novo edital disponível', read: false, date: new Date() },
    { id: '2', title: 'Seu perfil está incompleto', read: false, date: new Date() },
    { id: '3', title: 'Inscrição enviada com sucesso', read: true, date: new Date() }
  ]);

  useEffect(() => {
    // Redirecionar se não estiver autenticado
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

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
                    <Notifications color={notification.read ? 'disabled' : 'primary'} />
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
      </Grid>
    </Container>
  );
}; 

export default Dashboard; 