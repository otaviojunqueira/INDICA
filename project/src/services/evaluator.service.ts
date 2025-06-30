import api from '../config/axios';

export interface Evaluator {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
  };
  specialties: string[];
  biography: string;
  education: string;
  experience: string;
  isActive: boolean;
}

export interface EvaluatorInput {
  userId: string;
  specialties: string[];
  biography: string;
  education: string;
  experience: string;
}

const evaluatorService = {
  // Listar todos os pareceristas
  getAllEvaluators: async (params?: { query?: string; specialty?: string; isActive?: boolean }) => {
    const response = await api.get('/evaluators', { params });
    return response.data;
  },

  // Obter parecerista por ID
  getEvaluatorById: async (id: string) => {
    const response = await api.get(`/evaluators/${id}`);
    return response.data;
  },

  // Listar pareceristas por especialidade
  getEvaluatorsBySpecialty: async (specialty: string) => {
    const response = await api.get(`/evaluators/specialty/${specialty}`);
    return response.data;
  },

  // Criar um novo parecerista
  createEvaluator: async (evaluatorData: EvaluatorInput) => {
    const response = await api.post('/evaluators', evaluatorData);
    return response.data;
  },

  // Atualizar um parecerista existente
  updateEvaluator: async (id: string, evaluatorData: Partial<EvaluatorInput>) => {
    const response = await api.put(`/evaluators/${id}`, evaluatorData);
    return response.data;
  },

  // Atualizar status de um parecerista (ativar/desativar)
  updateEvaluatorStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/evaluators/${id}/status`, { isActive });
    return response.data;
  },

  // Excluir um parecerista
  deleteEvaluator: async (id: string) => {
    const response = await api.delete(`/evaluators/${id}`);
    return response.data;
  }
};

export default evaluatorService; 