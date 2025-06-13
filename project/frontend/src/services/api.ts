import axios, { AxiosInstance } from 'axios';

// Defina tipos mais específicos para dados de usuário
interface UserData {
  cpfCnpj: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
  entityId?: string;
}

// Tipo para parâmetros de consulta
interface QueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: string;
  [key: string]: unknown;
}

// Tipos para dados de edital
interface NoticeData {
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  budget: number;
  categories: string[];
  status?: string;
  [key: string]: unknown;
}

// Tipos para dados de inscrição
interface ApplicationData {
  noticeId: string;
  projectName: string;
  projectDescription: string;
  budget: number;
  documents: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

// Tipos para dados de avaliação
interface EvaluationData {
  applicationId: string;
  scores: Record<string, number>;
  comments: string;
  status?: string;
  [key: string]: unknown;
}

// Em aplicações Vite, usamos import.meta.env em vez de process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Criar instância do axios com configuração base
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro for 401 (não autorizado), redirecionar para login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  register: async (userData: UserData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (userData: Partial<UserData>) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Serviços de editais
export const noticeService = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get('/notices', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/notices/${id}`);
    return response.data;
  },
  create: async (noticeData: NoticeData) => {
    const response = await api.post('/notices', noticeData);
    return response.data;
  },
  update: async (id: string, noticeData: Partial<NoticeData>) => {
    const response = await api.put(`/notices/${id}`, noticeData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/notices/${id}`);
    return response.data;
  },
  publish: async (id: string) => {
    const response = await api.patch(`/notices/${id}/publish`);
    return response.data;
  },
};

// Serviços de inscrições
export const applicationService = {
  getAll: async (params?: QueryParams) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },
  getMyApplications: async (params?: QueryParams) => {
    const response = await api.get('/applications/my-applications', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },
  create: async (applicationData: ApplicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },
  update: async (id: string, applicationData: Partial<ApplicationData>) => {
    const response = await api.put(`/applications/${id}`, applicationData);
    return response.data;
  },
  submit: async (id: string) => {
    const response = await api.patch(`/applications/${id}/submit`);
    return response.data;
  },
};

// Serviços de avaliações
export const evaluationService = {
  getMyEvaluations: async (params?: QueryParams) => {
    const response = await api.get('/evaluations/my-evaluations', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/evaluations/${id}`);
    return response.data;
  },
  create: async (evaluationData: EvaluationData) => {
    const response = await api.post('/evaluations', evaluationData);
    return response.data;
  },
  update: async (id: string, evaluationData: Partial<EvaluationData>) => {
    const response = await api.put(`/evaluations/${id}`, evaluationData);
    return response.data;
  },
  getApplicationEvaluations: async (applicationId: string) => {
    const response = await api.get(`/evaluations/application/${applicationId}`);
    return response.data;
  },
  assignEvaluators: async (applicationId: string, evaluatorIds: string[]) => {
    const response = await api.post(`/evaluations/application/${applicationId}/assign`, { evaluatorIds });
    return response.data;
  },
};

export default api; 