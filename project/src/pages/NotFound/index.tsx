import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh'
        }}
      >
        <Typography variant="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Página não encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          A página que você está procurando não existe ou foi removida.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Voltar para a página inicial
        </Button>
      </Box>
    </Container>
  );
}; 