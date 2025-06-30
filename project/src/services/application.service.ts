import api from '../config/axios';

export interface Application {
  id: string;
  noticeId: string;
  userId: string;
  title: string;
  description: string;
  budget?: number;
  attachments?: string[];
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  notice?: {
    id: string;
    title: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApplicationInput {
  noticeId: string;
  title: string;
  description: string;
  budget?: number;
  attachments?: string[];
}

export interface ApplicationQueryParams {
  status?: string;
  noticeId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

const applicationService = {
  // Listar todas as inscrições
  getAll: async (params?: ApplicationQueryParams) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },
  
  // Obter inscrições do usuário logado
  getMyApplications: async (params?: ApplicationQueryParams) => {
    const response = await api.get('/applications/my-applications', { params });
    return response.data;
  },
  
  // Obter uma inscrição específica
  getById: async (id: string) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },
  
  // Criar uma nova inscrição
  create: async (applicationData: ApplicationInput) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },
  
  // Atualizar uma inscrição existente
  update: async (id: string, applicationData: Partial<ApplicationInput>) => {
    const response = await api.put(`/applications/${id}`, applicationData);
    return response.data;
  },
  
  // Submeter uma inscrição para avaliação
  submit: async (id: string) => {
    const response = await api.patch(`/applications/${id}/submit`);
    return response.data;
  }
};

export default applicationService; 