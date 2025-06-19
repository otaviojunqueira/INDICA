import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Divider, List, ListItem, ListItemText, Chip, Avatar, Paper, CircularProgress } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GroupsIcon from '@mui/icons-material/Groups';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
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

export const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ role, userName }) => {
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

  // Dashboard para administradores
  const AdminDashboard = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
                Painel Administrativo
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Editais</Typography>
              </Box>
              <Typography variant="h4" color="primary">{mockNotices.length}</Typography>
              <Typography variant="body2" color="textSecondary">
                {openNotices.length} editais abertos atualmente
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ mt: 2 }}
                component={RouterLink}
                to="/admin/create-notice"
              >
                Criar Novo Edital
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InsertDriveFileIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Inscrições</Typography>
              </Box>
              <Typography variant="h4" color="primary">24</Typography>
              <Typography variant="body2" color="textSecondary">
                8 inscrições novas nos últimos 7 dias
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ mt: 2 }}
                component={RouterLink}
                to="/applications"
              >
                Ver Inscrições
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Relatórios</Typography>
              </Box>
              <Typography variant="h4" color="primary">5</Typography>
              <Typography variant="body2" color="textSecondary">
                Relatórios disponíveis para análise
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ mt: 2 }}
                component={RouterLink}
                to="/admin/reports"
              >
                Gerar Relatórios
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Editais Recentes
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <List>
          {mockNotices.slice(0, 5).map((notice) => (
            <ListItem 
              key={notice.id}
              secondaryAction={
                <Chip 
                  label={getStatusText(notice.status)}
                  color={getStatusColor(notice.status) as any}
                  size="small"
                />
              }
            >
              <ListItemText
                primary={notice.title}
                secondary={`Prazo: ${new Date(notice.endDate).toLocaleDateString('pt-BR')}`}
                onClick={() => navigate(`/notice/${notice.id}`)}
                sx={{ cursor: 'pointer' }}
              />
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            component={RouterLink}
            to="/notices"
            color="primary"
          >
            Ver Todos os Editais
            </Button>
        </Box>
      </Paper>
    </Box>
  );

  // Dashboard para agentes culturais
  const AgentDashboard = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Olá, {userName}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InsertDriveFileIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Minhas Inscrições</Typography>
              </Box>
              <Typography variant="h4" color="primary">{mockApplications.length}</Typography>
              <Typography variant="body2" color="textSecondary">
                {mockApplications.filter(app => app.status === 'under_review').length} em análise
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ mt: 2 }}
                component={RouterLink}
                to="/applications"
              >
                Ver Minhas Inscrições
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Editais Abertos</Typography>
              </Box>
              <Typography variant="h4" color="primary">{openNotices.length}</Typography>
              <Typography variant="body2" color="textSecondary">
                Oportunidades disponíveis
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ mt: 2 }}
                component={RouterLink}
                to="/notices"
              >
                Ver Editais
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Meus Coletivos</Typography>
              </Box>
              <Typography variant="h4" color="primary">{userGroups.length}</Typography>
              <Typography variant="body2" color="textSecondary">
                Coletivos cadastrados
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ mt: 2 }}
                component={RouterLink}
                to="/cultural-groups"
              >
                Gerenciar Coletivos
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Minhas Inscrições Recentes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {mockApplications.length > 0 ? (
              <List>
                {mockApplications.slice(0, 3).map((application) => (
                  <ListItem 
                    key={application.id}
                    secondaryAction={
                      <Chip 
                        label={getStatusText(application.status)}
                        color={getStatusColor(application.status) as any}
                        size="small"
                      />
                    }
                  >
                    <ListItemText
                      primary={application.title}
                      secondary={`Edital: ${application.noticeTitle}`}
                      onClick={() => navigate(`/application/${application.id}`)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="textSecondary">
                Você ainda não possui inscrições em editais.
              </Typography>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                component={RouterLink}
                to="/applications"
                color="primary"
              >
                Ver Todas as Inscrições
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Editais em Aberto
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {openNotices.slice(0, 3).map((notice) => (
                <ListItem 
                  key={notice.id}
                  secondaryAction={
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => navigate(`/application/new?editalId=${notice.id}`)}
                    >
                      Inscrever-se
                    </Button>
                  }
                >
                  <ListItemText
                    primary={notice.title}
                    secondary={`Prazo: ${new Date(notice.endDate).toLocaleDateString('pt-BR')}`}
                    onClick={() => navigate(`/notice/${notice.id}`)}
                    sx={{ cursor: 'pointer' }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                component={RouterLink}
                to="/notices"
                color="primary"
              >
                Ver Todos os Editais
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Meu Perfil
            </Typography>
            <Button
              startIcon={<EditIcon />}
              component={RouterLink}
              to="/profile"
            >
              Editar Perfil
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3
              }}
            >
              {userName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">{userName}</Typography>
              <Typography variant="body1" color="textSecondary">Agente Cultural</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  // Dashboard para avaliadores (pareceristas)
  const EvaluatorDashboard = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Painel do Parecerista
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Avaliações Pendentes</Typography>
              </Box>
              <Typography variant="h4" color="primary">{pendingEvaluations}</Typography>
              <Typography variant="body2" color="textSecondary">
                Inscrições aguardando avaliação
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ mt: 2 }}
                component={RouterLink}
                to="/evaluator/applications"
              >
                Avaliar Inscrições
            </Button>
            </CardContent>
        </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Notificações</Typography>
              </Box>
              <Typography variant="h4" color="primary">3</Typography>
              <Typography variant="body2" color="textSecondary">
                3 notificações não lidas
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ mt: 2 }}
              >
                Ver Notificações
            </Button>
            </CardContent>
        </Card>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Editais em Avaliação
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <List>
          {mockNotices.filter(notice => notice.status === 'evaluation').map((notice) => (
            <ListItem key={notice.id}>
              <ListItemText
                primary={notice.title}
                secondary={`Prazo para avaliação: ${new Date(notice.steps.find(step => step.name.includes('Avaliação'))?.endDate || '').toLocaleDateString('pt-BR')}`}
                onClick={() => navigate(`/notice/${notice.id}`)}
                sx={{ cursor: 'pointer' }}
              />
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            component={RouterLink}
            to="/notices"
            color="primary"
          >
            Ver Todos os Editais
          </Button>
        </Box>
      </Paper>
    </Box>
  );

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