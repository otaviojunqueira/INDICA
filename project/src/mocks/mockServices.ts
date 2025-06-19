import { 
  currentUser,
  agentProfile,
  culturalGroup,
  mockNotices,
  mockApplications
} from './data';
import { User, IAgentProfile, Notice, Application, CulturalGroup } from '../types';

// Flag para determinar se usa dados simulados
export const USE_MOCK_DATA = true;

// Serviço de autenticação simulado
export const authService = {
  login: async (cpfCnpj: string, password: string): Promise<{user: User, token: string}> => {
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (cpfCnpj === '123.456.789-01' && password === 'senha123') {
      return {
        user: currentUser,
        token: 'mock-jwt-token'
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
