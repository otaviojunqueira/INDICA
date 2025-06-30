import api from '../config/axios';

export interface Evaluation {
  id: string;
  applicationId: string;
  evaluatorId: string;
  criteria: Array<{
    name: string;
    weight: number;
    score: number;
    comments: string;
  }>;
  totalScore: number;
  comments: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface EvaluationInput {
  applicationId: string;
  criteria: Array<{
    name: string;
    weight: number;
    score: number;
    comments: string;
  }>;
  comments: string;
}

export interface EvaluationQueryParams {
  status?: string;
  applicationId?: string;
  evaluatorId?: string;
  startDate?: string;
  endDate?: string;
}

const evaluationService = {
  // Obter avaliações do avaliador logado
  getMyEvaluations: async (params?: EvaluationQueryParams) => {
    const response = await api.get('/evaluations/my-evaluations', { params });
    return response.data;
  },
  
  // Obter uma avaliação específica
  getById: async (id: string) => {
    const response = await api.get(`/evaluations/${id}`);
    return response.data;
  },
  
  // Criar nova avaliação
  create: async (evaluationData: EvaluationInput) => {
    const response = await api.post('/evaluations', evaluationData);
    return response.data;
  },
  
  // Atualizar uma avaliação existente
  update: async (id: string, evaluationData: Partial<EvaluationInput>) => {
    const response = await api.put(`/evaluations/${id}`, evaluationData);
    return response.data;
  },
  
  // Obter avaliações de uma inscrição
  getApplicationEvaluations: async (applicationId: string) => {
    const response = await api.get(`/evaluations/application/${applicationId}`);
    return response.data;
  },
  
  // Designar avaliadores para uma inscrição
  assignEvaluators: async (applicationId: string, evaluatorIds: string[]) => {
    const response = await api.post(`/evaluations/application/${applicationId}/assign`, { evaluatorIds });
    return response.data;
  },
  
  // Submeter uma avaliação
  submitEvaluation: async (id: string) => {
    const response = await api.post(`/evaluations/${id}/submit`);
    return response.data;
  }
};

export default evaluationService; 