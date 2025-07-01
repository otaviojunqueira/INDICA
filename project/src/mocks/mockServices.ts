import { 
  currentUser,
  agentProfile,
  culturalGroup,
  mockNotices,
  mockApplications,
  users
} from './data';
import { User, IAgentProfile, Notice, Application, CulturalGroup, Evaluation, EvaluationInfo } from '../types';

// Flag para determinar se usa dados simulados
export const USE_MOCK_DATA = true;

// Serviço de autenticação simulado
export const authService = {
  login: async (cpfCnpj: string, password: string): Promise<{user: User, token: string}> => {
    console.log('MOCK LOGIN RECEBIDO:', { cpfCnpj, password });
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Login para agente cultural
    if (cpfCnpj === '123.456.789-01' && password === 'senha123') {
      return {
        user: users.find(u => u.role === 'agent')!,
        token: 'mock-jwt-token-agent'
      };
    }
    
    // Login para admin
    if (cpfCnpj.trim() === '987.654.321-00' && password.trim() === 'admin123') {
      return {
        user: users.find(u => u.role === 'admin')!,
        token: 'mock-jwt-token-admin'
      };
    }
    
    // Login para parecerista (avaliador)
    if (cpfCnpj === '456.789.123-45' && password === 'avaliador123') {
      return {
        user: users.find(u => u.role === 'evaluator')!,
        token: 'mock-jwt-token-evaluator'
      };
    }
    
    throw new Error('Credenciais inválidas');
  },
  
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },
  
  register: async (userData: User): Promise<{user: User, token: string}> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      user: {
        ...currentUser,
        ...userData,
        id: '2'
      },
      token: 'mock-jwt-token'
    };
  },
  
  checkAuth: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return currentUser;
  }
};

// Serviço de perfil de agente simulado
export const mockAgentProfileService = {
  getProfile: async (): Promise<IAgentProfile> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return agentProfile;
  },
  
  saveProfile: async (data: Partial<IAgentProfile>): Promise<IAgentProfile> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      ...agentProfile,
      ...data,
      updatedAt: new Date()
    };
  },
  
  updateProfile: async (userId: string, data: Partial<IAgentProfile>): Promise<IAgentProfile> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      ...agentProfile,
      ...data,
      updatedAt: new Date()
    };
  }
};

// Serviço de coletivo cultural simulado
export const mockCulturalGroupService = {
  getGroup: async (): Promise<CulturalGroup> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return culturalGroup;
  },
  
  saveGroup: async (data: Partial<CulturalGroup>): Promise<CulturalGroup> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      ...culturalGroup,
      ...data,
      updatedAt: new Date()
    };
  }
};

// Serviço de editais simulado
export const mockNoticeService = {
  getNotices: async (): Promise<Notice[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockNotices;
  },
  
  getNotice: async (id: string): Promise<Notice> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const notice = mockNotices.find((n: Notice) => n.id === id);
    if (!notice) {
      throw new Error('Edital não encontrado');
    }
    return notice;
  }
};

// Serviço de inscrições simulado
export const mockApplicationService = {
  getApplications: async (): Promise<Application[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockApplications;
  },
  
  getApplication: async (id: string): Promise<Application> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const application = mockApplications.find((a: Application) => a.id === id);
    if (!application) {
      throw new Error('Inscrição não encontrada');
    }
    return application;
  },
  
  createApplication: async (data: Partial<Application>): Promise<Application> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const now = new Date().toISOString();
    return {
      ...mockApplications[0],
      ...data,
      id: (mockApplications.length + 1).toString(),
      submissionDate: now
    };
  }
};

// Serviço de avaliações simulado
export const mockEvaluationService = {
  getById: async (id: string): Promise<Evaluation> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock de dados de avaliação
    return {
      id: id,
      applicationId: '1',
      evaluatorId: '3', // ID do parecerista
      date: new Date().toISOString(),
      status: 'pending',
      score: 0,
      comments: '',
      result: 'pending_adjustment',
      criteriaScores: [
        {
          criteriaId: '1',
          score: 0,
          comments: ''
        },
        {
          criteriaId: '2',
          score: 0,
          comments: ''
        }
      ]
    };
  },
  
  update: async (id: string, data: Partial<Evaluation>): Promise<Evaluation> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simula atualização da avaliação
    return {
      id: id,
      applicationId: data.applicationId || '1',
      evaluatorId: data.evaluatorId || '3',
      date: data.date || new Date().toISOString(),
      status: data.status || 'pending',
      score: data.score || 0,
      comments: data.comments || '',
      result: data.result || 'pending_adjustment',
      criteriaScores: data.criteriaScores || []
    };
  },
  
  getEvaluationsByEvaluator: async (): Promise<EvaluationInfo[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Mock de lista de avaliações
    return [
      {
        id: '1',
        evaluatorId: '3',
        evaluatorName: 'Maria Oliveira',
        date: new Date().toISOString(),
        score: 0,
        comments: '',
        status: 'pending_adjustment',
        criteriaScores: [
          {
            criteriaId: '1',
            criteriaName: 'Relevância Cultural',
            score: 0,
            maxScore: 10
          }
        ]
      },
      {
        id: '2',
        evaluatorId: '3',
        evaluatorName: 'Maria Oliveira',
        date: new Date().toISOString(),
        score: 0,
        comments: '',
        status: 'pending_adjustment',
        criteriaScores: [
          {
            criteriaId: '2',
            criteriaName: 'Viabilidade Técnica',
            score: 0,
            maxScore: 10
          }
        ]
      }
    ];
  }
};
