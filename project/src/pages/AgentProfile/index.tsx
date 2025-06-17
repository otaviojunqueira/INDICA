import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../auth';
import { ProfileForm } from '../../components/AgentProfile/ProfileForm';
import { agentProfileService, IAgentProfile } from '../../services/agentProfile.service';

export const AgentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: storeUser } = useAuthStore();
  const { user: authUser } = useAuth();
  const user = authUser || storeUser; // Usar o usuário do contexto de autenticação ou do store
  
  const [profile, setProfile] = useState<Partial<IAgentProfile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      if (!user?.id) {
        navigate('/login');
        return;
      }

      const profileData = await agentProfileService.getProfileByUserId(user.id);
      setProfile(profileData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao carregar perfil');
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

      // Se já existe um perfil, atualiza. Senão, cria um novo.
      const updatedProfile = profile?.userId
        ? await agentProfileService.updateProfile(profile.userId, values)
        : await agentProfileService.saveProfile({ ...values, userId: user?.id });

      setProfile(updatedProfile);
      setSuccess('Perfil salvo com sucesso!');

      // Redireciona para a página principal após alguns segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao salvar perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh'
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Perfil do Agente Cultural
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Preencha seus dados para participar de editais e conectar-se com outros agentes culturais.
        </Typography>

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

        <ProfileForm
          initialValues={profile || {}}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </Paper>
    </Container>
  );
}; 