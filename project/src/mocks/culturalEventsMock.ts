// project/src/mocks/culturalEventsMock.ts

// Interface para eventos culturais
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
  address: string;
  website?: string;
  contactInfo?: string;
  imageUrl?: string;
  status: 'ativo' | 'finalizado' | 'agendado' | 'cancelado';
}

// Interface para filtros de eventos
export interface EventFilters {
  state?: string;
  category?: string;
  eventType?: string;
  status?: string;
}

// Dados fictícios para eventos culturais
export const mockCulturalEvents: CulturalEvent[] = [
  {
    id: '1',
    title: 'Festival de Música Regional',
    description: 'O maior festival de música regional do país, com apresentações de artistas locais e nacionais.',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 18),
    city: 'Salvador',
    state: 'BA',
    eventType: 'Cultural',
    category: 'Artístico/Cultural/Folclórico',
    address: 'Praça Castro Alves, Centro',
    website: 'https://festivalmusicaregional.com.br',
    contactInfo: 'contato@festivalmusicaregional.com.br',
    imageUrl: 'https://source.unsplash.com/random/800x600/?music',
    status: 'ativo'
  },
  {
    id: '2',
    title: 'Exposição de Arte Contemporânea',
    description: 'Exposição com obras de artistas contemporâneos brasileiros, explorando temas sociais e ambientais.',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10),
    city: 'São Paulo',
    state: 'SP',
    eventType: 'Cultural',
    category: 'Artístico/Cultural/Folclórico',
    address: 'Av. Paulista, 1578 - Bela Vista',
    website: 'https://exposicaoartecontemporanea.com.br',
    contactInfo: 'contato@exposicaoarte.com.br',
    imageUrl: 'https://source.unsplash.com/random/800x600/?art',
    status: 'ativo'
  },
  // ... adicione mais 8 eventos como nos exemplos anteriores
];

// Inicializar localStorage com eventos culturais
export const initCulturalEvents = () => {
  if (!localStorage.getItem('culturalEvents')) {
    localStorage.setItem('culturalEvents', JSON.stringify(mockCulturalEvents));
  }
};

// Serviço mock para eventos culturais
export const culturalEventService = {
  getEvents: (filters: EventFilters = {}) => {
    initCulturalEvents(); // Garante que os dados estão inicializados
    
    const events = JSON.parse(localStorage.getItem('culturalEvents') || '[]');
    
    // Converter strings de data para objetos Date
    const eventsWithDates = events.map((event: CulturalEvent) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }));
    
    // Aplicar filtros se houver
    if (Object.keys(filters).length > 0) {
      const { state, category, eventType, status } = filters;
      
      let filteredEvents = eventsWithDates;
      
      if (state) {
        filteredEvents = filteredEvents.filter((event: CulturalEvent) => event.state === state);
      }
      
      if (category) {
        filteredEvents = filteredEvents.filter((event: CulturalEvent) => event.category === category);
      }
      
      if (eventType) {
        filteredEvents = filteredEvents.filter((event: CulturalEvent) => event.eventType === eventType);
      }
      
      if (status) {
        filteredEvents = filteredEvents.filter((event: CulturalEvent) => event.status === status);
      }
      
      return Promise.resolve(filteredEvents);
    }
    
    return Promise.resolve(eventsWithDates);
  },
  
  getEventById: (id: string) => {
    initCulturalEvents(); // Garante que os dados estão inicializados
    
    const events = JSON.parse(localStorage.getItem('culturalEvents') || '[]');
    const event = events.find((e: CulturalEvent) => e.id === id);
    
    if (event) {
      // Converter strings de data para objetos Date
      return Promise.resolve({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      });
    }
    
    return Promise.resolve(null);
  },
  
  createEvent: (eventData: Omit<CulturalEvent, 'id'>) => {
    initCulturalEvents(); // Garante que os dados estão inicializados
    
    const events = JSON.parse(localStorage.getItem('culturalEvents') || '[]');
    const newEvent = {
      ...eventData,
      id: (events.length + 1).toString(),
      status: 'ativo'
    };
    
    events.push(newEvent);
    localStorage.setItem('culturalEvents', JSON.stringify(events));
    
    return Promise.resolve(newEvent);
  },
  
  updateEvent: (id: string, eventData: Partial<CulturalEvent>) => {
    initCulturalEvents(); // Garante que os dados estão inicializados
    
    const events = JSON.parse(localStorage.getItem('culturalEvents') || '[]');
    const index = events.findIndex((e: CulturalEvent) => e.id === id);
    
    if (index !== -1) {
      events[index] = { ...events[index], ...eventData };
      localStorage.setItem('culturalEvents', JSON.stringify(events));
      return Promise.resolve(events[index]);
    }
    
    return Promise.reject(new Error('Evento não encontrado'));
  },
  
  deleteEvent: (id: string) => {
    initCulturalEvents(); // Garante que os dados estão inicializados
    
    const events = JSON.parse(localStorage.getItem('culturalEvents') || '[]');
    const filteredEvents = events.filter((e: CulturalEvent) => e.id !== id);
    localStorage.setItem('culturalEvents', JSON.stringify(filteredEvents));
    
    return Promise.resolve({ success: true });
  }
};
