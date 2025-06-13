import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface EvaluatorRouteProps {
  element: React.ReactNode;
  redirectTo?: string;
}

const EvaluatorRoute: React.FC<EvaluatorRouteProps> = ({ 
  element, 
  redirectTo = '/' 
}) => {
  const { isEvaluator, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Permitir acesso tanto para avaliadores quanto para administradores
  return (isEvaluator || isAdmin) ? <>{element}</> : <Navigate to={redirectTo} />;
};

export default EvaluatorRoute; 