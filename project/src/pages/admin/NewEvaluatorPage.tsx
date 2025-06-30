import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NewEvaluatorPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cadastrar Novo Parecerista
      </Typography>
      <Typography variant="body1" paragraph>
        Esta p�gina est� em constru��o. Em breve voc� poder� cadastrar novos pareceristas aqui.
      </Typography>
      <Box mt={3}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/admin/evaluators')}
        >
          Voltar para Lista de Pareceristas
        </Button>
      </Box>
    </Container>
  );
};

export default NewEvaluatorPage;
