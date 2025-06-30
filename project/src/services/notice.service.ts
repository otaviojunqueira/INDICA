import api from '../config/axios';

export interface Notice {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  entityId: string;
  budget?: number;
  attachments?: string[];
  requirements?: string[];
  criteria?: Array<{
    name: string;
    description: string;
    weight: number;
  }>;
  status: 'draft' | 'published' | 'closed' | 'canceled';
  createdAt: Date;
  updatedAt: Date;
  entity?: {
    id: string;
    name: string;
  };
}

export interface NoticeInput {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  budget?: number;
  attachments?: string[];
  requirements?: string[];
  criteria?: Array<{
    name: string;
    description: string;
    weight: number;
  }>;
}

export interface NoticeQueryParams {
  status?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

const noticeService = {
  // Listar todos os editais
  getAll: async (params?: NoticeQueryParams) => {
    const response = await api.get('/notices', { params });
    return response.data;
  },
  
  // Obter um edital específico
  getById: async (id: string) => {
    const response = await api.get(`/notices/${id}`);
    return response.data;
  },
  
  // Criar um novo edital
  create: async (noticeData: NoticeInput) => {
    const response = await api.post('/notices', noticeData);
    return response.data;
  },
  
  // Atualizar um edital existente
  update: async (id: string, noticeData: Partial<NoticeInput>) => {
    const response = await api.put(`/notices/${id}`, noticeData);
    return response.data;
  },
  
  // Excluir um edital
  delete: async (id: string) => {
    const response = await api.delete(`/notices/${id}`);
    return response.data;
  },
  
  // Publicar um edital
  publish: async (id: string) => {
    const response = await api.patch(`/notices/${id}/publish`);
    return response.data;
  }
};

export default noticeService; 