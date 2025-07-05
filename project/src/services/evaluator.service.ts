import { api } from './api';

export interface Evaluator {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
  };
  entityId: {
    id: string;
    name: string;
  };
  culturalSector: string;
  specialties: string[];
  biography: string;
  education: string;
  experience: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEvaluatorData {
  name: string;
  email: string;
  culturalSector: string;
  specialties: string[];
  biography: string;
  education: string;
  experience: string;
}

export interface UpdateEvaluatorData {
  specialties?: string[];
  biography?: string;
  education?: string;
  experience?: string;
  isActive?: boolean;
}

const evaluatorService = {
  // Listar todos os pareceristas
  listEvaluators: async (filters?: {
    culturalSector?: string;
    specialty?: string;
    active?: boolean;
    query?: string;
  }) => {
    const response = await api.get('/evaluators', { params: filters });
    return response.data;
  },

  // Obter parecerista por ID
  getEvaluatorById: async (id: string) => {
    const response = await api.get(`/evaluators/${id}`);
    return response.data;
  },

  // Criar novo parecerista
  createEvaluator: async (data: CreateEvaluatorData) => {
    const response = await api.post('/evaluators', data);
    return response.data;
  },

  // Atualizar parecerista
  updateEvaluator: async (id: string, data: UpdateEvaluatorData) => {
    const response = await api.put(`/evaluators/${id}`, data);
    return response.data;
  },

  // Ativar/desativar parecerista
  toggleEvaluatorStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/evaluators/${id}/status`, { isActive });
    return response.data;
  }
};

export default evaluatorService; 