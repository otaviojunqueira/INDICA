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

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!isAuthenticated || !user) {
      console.log("Usuário não autenticado, redirecionando para login");
      navigate('/login');
      return;
    }

    // Verificar se o token existe no localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log("Token não encontrado, redirecionando para login");
      navigate('/login');
      return;
    }

    // Configurar o token para todas as requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Carregar o perfil
    loadProfile();
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    try {
      console.log("Carregando perfil do agente cultural...");
      setLoading(true);
      setError(null);
      
      const profileData = await agentProfileService.getProfile();
      console.log("Perfil carregado:", profileData);
      
      // Verificar se é um perfil vazio (novo)
      if (!profileData.userId) {
        console.log("Perfil novo detectado, será salvo ao submeter o formulário");
        // Não define mensagem de erro para perfis novos
      }
      
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

      console.log("Salvando perfil do agente cultural:", values);
      
      // Se já existe um perfil, atualiza. Senão, cria um novo.
      const updatedProfile = profile?.userId
        ? await agentProfileService.updateProfile(profile.userId, values)
        : await agentProfileService.saveProfile({ ...values, userId: user?.id });
      
      console.log("Perfil salvo com sucesso:", updatedProfile);
      
      setProfile(updatedProfile);
      setSuccess('Perfil salvo com sucesso!');

      // Redireciona para a página principal após alguns segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
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

export default AgentProfilePage; 