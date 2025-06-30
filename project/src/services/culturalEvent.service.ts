import api from '../config/axios';

export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  city: string;
  state: string;
  eventType: string;
  category: string;
  address?: string;
  website?: string;
  contactInfo?: string;
  imageUrl?: string;
  status: 'upcoming' | 'ongoing' | 'finished';
  createdBy: string;
}

export interface EventFilters {
  startDate?: string;
  endDate?: string;
  state?: string;
  city?: string;
  eventType?: string;
  category?: string;
  status?: string;
}

const culturalEventService = {
  // Obter todos os eventos ou filtrados
  getEvents: async (filters?: EventFilters) => {
    const response = await api.get('/cultural-events', { params: filters });
    return response.data;
  },
  
  // Obter um evento específico
  getEventById: async (id: string) => {
    const response = await api.get(`/cultural-events/${id}`);
    return response.data;
  },
  
  // Criar um novo evento
  createEvent: async (eventData: Omit<CulturalEvent, 'id'>) => {
    const response = await api.post('/cultural-events', eventData);
    return response.data;
  },
  
  // Atualizar um evento existente
  updateEvent: async (id: string, eventData: Partial<CulturalEvent>) => {
    const response = await api.put(`/cultural-events/${id}`, eventData);
    return response.data;
  },
  
  // Excluir um evento
  deleteEvent: async (id: string) => {
    const response = await api.delete(`/cultural-events/${id}`);
    return response.data;
  }
};

export default culturalEventService;
