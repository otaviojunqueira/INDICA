import React, { useState } from 'react';
import { Container, Box, Button, Dialog } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CulturalCalendar from './CulturalCalendar';
import EventForm from '../../components/Calendar/EventForm';
import { useAuthStore } from '../../store/authStore';
import { culturalEventService } from '../../mocks/culturalEventsMock';

// Interface para os valores do formulário de evento
interface EventFormValues {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  city: string;
  state: string;
  eventType: string;
  category: string;
  address: string;
  website: string;
  contactInfo: string;
  imageUrl: string;
}

const CalendarPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const handleFormSubmit = async (values: EventFormValues) => {
    try {
      // Usando o serviço mock em vez de chamar uma API real
      await culturalEventService.createEvent({
        ...values,
        startDate: values.startDate || new Date(),
        endDate: values.endDate || new Date(),
        status: 'ativo'
      });
      
      setIsFormOpen(false);
      // Recarregar a página para mostrar o novo evento
      window.location.reload();
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      alert('Erro ao criar evento. Por favor, tente novamente.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {isAdmin && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
          >
            Novo Evento
          </Button>
        </Box>
      )}

      <CulturalCalendar />

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <EventForm onSubmit={handleFormSubmit} />
      </Dialog>
    </Container>
  );
};

export default CalendarPage; 