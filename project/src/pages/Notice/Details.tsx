import React from 'react';
import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export const NoticeDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <Container>
      <Typography variant="h4">Detalhes do Edital</Typography>
      <Typography variant="body1" color="text.secondary">
        ID do Edital: {id}
      </Typography>
    </Container>
  );
}; 