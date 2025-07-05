import { api } from './api';

export interface Notice {
  id: string;
  _id?: string;
  title: string;
  description: string;
  entityId: string;
  cityId?: string;
  entity?: {
    name: string;
  };
  city?: {
    name: string;
    state: string;
  };
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  maxApplicationValue: number;
  minApplicationValue: number;
  categories: string[];
  requirements: string[];
  documents: string[];
  evaluationCriteria: EvaluationCriteria[];
  status: 'draft' | 'published' | 'evaluation' | 'result' | 'closed' | 'canceled';
  quotas: {
    blackQuota: number;
    indigenousQuota: number;
    disabilityQuota: number;
  };
  accessibility: {
    physical: string[];
    communicational: string[];
    attitudinal: string[];
  };
  stages: Stage[];
  appealPeriod: {
    selectionAppealDays: number;
    habilitationAppealDays: number;
  };
  habilitationDocuments: HabilitationDocument[];
  budget: {
    totalAmount: number;
    maxValue: number;
    minValue: number;
    allowedExpenses: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  isFromUserCity?: boolean;
}

export interface EvaluationCriteria {
  name: string;
  weight: number;
  description: string;
}

export interface Stage {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string;
}

export interface HabilitationDocument {
  name: string;
  description: string;
  required: boolean;
}

export interface NoticeInput {
  title: string;
  description: string;
  entityId: string;
  cityId?: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  maxApplicationValue: number;
  minApplicationValue: number;
  categories: string[];
  requirements: string[];
  documents: string[];
  evaluationCriteria: EvaluationCriteria[];
  quotas: {
    blackQuota: number;
    indigenousQuota: number;
    disabilityQuota: number;
  };
  accessibility: {
    physical: string[];
    communicational: string[];
    attitudinal: string[];
  };
  stages: Stage[];
  appealPeriod: {
    selectionAppealDays: number;
    habilitationAppealDays: number;
  };
  habilitationDocuments: HabilitationDocument[];
  budget: {
    totalAmount: number;
    maxValue: number;
    minValue: number;
    allowedExpenses: string[];
  };
}

export interface NoticeQueryParams {
  status?: string;
  category?: string;
  entity?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  query?: string;
  page?: number;
  limit?: number;
}

const noticeService = {
  // Listar todos os editais
  getAll: async (params?: NoticeQueryParams) => {
    const response = await api.get('/notices', { params });
    
    if (response.data && response.data.notices) {
      const notices = response.data.notices.map((notice: Notice) => {
        return {
          ...notice,
          id: notice._id || notice.id,
          isFromUserCity: notice.city && notice.city.name ? true : false
        };
      });
      
      return {
        notices,
        pagination: response.data.pagination
      };
    }
    
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