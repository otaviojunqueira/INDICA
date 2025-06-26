import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button,
  Grid,
  Divider,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Dialog,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  CalendarToday,
  Wc as GenderIcon,
  School as EducationIcon,
  AccountBalance as IncomeIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import ProfileForm from '../../components/AgentProfile/ProfileForm';
import { agentProfileService } from '../../services/agentProfile.service';
import { IAgentProfile } from '../../types';
import api from '../../config/axios';

const AgentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [profile, setProfile] = useState<Partial<IAgentProfile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    loadProfile();
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await agentProfileService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao carregar perfil do agente cultural. Por favor, tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: Partial<IAgentProfile>) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const updatedProfile = profile?.userId
        ? await agentProfileService.updateProfile(profile.userId, values)
        : await agentProfileService.saveProfile({ ...values, userId: user?.id });
      
      setProfile(updatedProfile);
      setSuccess('Perfil salvo com sucesso!');
      setIsEditing(false);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao salvar perfil do agente cultural. Por favor, tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const ProfileHeader = () => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 3, 
      mb: 4,
      p: 3,
      backgroundColor: 'primary.main',
      color: 'white',
      borderRadius: 1,
    }}>
      <Avatar
        sx={{ 
          width: 100, 
          height: 100,
          bgcolor: 'primary.light',
          border: '4px solid white'
        }}
      >
        <PersonIcon sx={{ fontSize: 50 }} />
      </Avatar>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {user?.name}
        </Typography>
        <Typography variant="subtitle1">
          Agente Cultural
        </Typography>
      </Box>
    </Box>
  );

  const InfoCard = ({ 
    title, 
    icon, 
    children 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode; 
  }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
          {icon}
          <Typography variant="h6" color="primary">
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );

  const ProfileDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <InfoCard 
          title="Dados Pessoais" 
          icon={<PersonIcon color="primary" />}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body1">
                  <strong>Data de Nascimento:</strong> {profile?.birthDate ? new Date(profile.birthDate).toLocaleDateString('pt-BR') : 'Não informado'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <GenderIcon fontSize="small" color="action" />
                <Typography variant="body1">
                  <strong>Gênero:</strong> {profile?.gender || 'Não informado'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body1">
                  <strong>Raça/Etnia:</strong> {profile?.ethnicity || 'Não informado'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EducationIcon fontSize="small" color="action" />
                <Typography variant="body1">
                  <strong>Escolaridade:</strong> {profile?.education || 'Não informado'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </InfoCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <InfoCard 
          title="Endereço" 
          icon={<HomeIcon color="primary" />}
        >
          {profile?.street ? (
            <>
              <Typography variant="body1" paragraph>
                {profile.street}, {profile.number}
                {profile.complement && ` - ${profile.complement}`}
              </Typography>
              <Typography variant="body1" paragraph>
                {profile.neighborhood}
              </Typography>
              <Typography variant="body1" paragraph>
                {profile.city}/{profile.state}
              </Typography>
              <Typography variant="body1">
                CEP: {profile.zipCode}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Endereço não informado
            </Typography>
          )}
        </InfoCard>
      </Grid>

      <Grid item xs={12}>
        <InfoCard 
          title="Dados Socioeconômicos" 
          icon={<WorkIcon color="primary" />}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IncomeIcon fontSize="small" color="action" />
                <Typography variant="body1">
                  <strong>Renda Familiar:</strong> {profile?.familyIncome || 'Não informado'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon fontSize="small" color="action" />
                <Typography variant="body1">
                  <strong>Ocupação Principal:</strong> {profile?.occupation || 'Não informado'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </InfoCard>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title="Editar Perfil">
            <IconButton
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{ 
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {!isEditing ? (
          <>
            <ProfileHeader />
            <ProfileDetails />
          </>
        ) : (
          <Dialog
            open={isEditing}
            onClose={() => setIsEditing(false)}
            maxWidth="md"
            fullWidth
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Editar Perfil
              </Typography>
              <ProfileForm
                initialValues={profile || {}}
                onSubmit={handleSubmit}
                isLoading={loading}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                  sx={{ mr: 1 }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Dialog>
        )}
      </Box>
    </Container>
  );
};

export default AgentProfilePage; 