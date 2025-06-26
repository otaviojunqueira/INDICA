import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { agentProfileService } from '../services/agentProfile.service';
import { CircularProgress, Box } from '@mui/material';

interface CulturalGroupRouteProps {
  children: React.ReactNode;
}

const CulturalGroupRoute: React.FC<CulturalGroupRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [hasCulturalGroup, setHasCulturalGroup] = useState(false);

  useEffect(() => {
    const checkCulturalGroupAccess = async () => {
      try {
        const profile = await agentProfileService.getProfile();
        setHasCulturalGroup(profile?.hasCulturalGroup || false);
      } catch (error) {
        console.error('Erro ao verificar acesso ao coletivo cultural:', error);
        setHasCulturalGroup(false);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      checkCulturalGroupAccess();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasCulturalGroup) {
    return <Navigate to="/profile" />;
  }

  return <>{children}</>;
};

export default CulturalGroupRoute; 