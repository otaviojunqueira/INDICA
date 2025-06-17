import { api } from '../config/axios';

export interface IAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IAgentProfile {
  // Dados Pessoais
  userId: string;
  dateOfBirth: Date;
  gender: string;
  raceEthnicity: string;
  education: string;

  // Endereço
  address: IAddress;

  // Dados Socioeconômicos
  monthlyIncome: number;
  householdIncome: number;
  householdMembers: number;
  occupation: string;
  workRegime: string;

  // Dados Culturais
  culturalArea: string[];
  yearsOfExperience: number;
  biography: string;
  portfolio?: string[];

  // Dados de Acessibilidade
  hasDisability: boolean;
  disabilityDetails?: string;
  accessibilityNeeds?: string[];

  // Metadados
  createdAt: Date;
  updatedAt: Date;
}

export const agentProfileService = {
  // Obter perfil do agente
  getProfile: async (): Promise<IAgentProfile> => {
    const response = await api.get('/agent-profile');
    return response.data.data;
  },

  // Obter perfil do agente por ID de usuário
  getProfileByUserId: async (userId: string): Promise<IAgentProfile> => {
    try {
      const response = await api.get(`/agent-profile/user/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar perfil do agente:', error);
      throw new Error('Não foi possível carregar o perfil do agente cultural');
    }
  },

  // Salvar novo perfil do agente
  saveProfile: async (profileData: Partial<IAgentProfile>): Promise<IAgentProfile> => {
    try {
      const response = await api.post('/agent-profile', profileData);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao salvar perfil do agente:', error);
      throw new Error('Não foi possível salvar o perfil do agente cultural');
    }
  },

  // Atualizar perfil do agente
  updateProfile: async (userId: string, profileData: Partial<IAgentProfile>): Promise<IAgentProfile> => {
    try {
      const response = await api.put(`/agent-profile/${userId}`, profileData);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil do agente:', error);
      throw new Error('Não foi possível atualizar o perfil do agente cultural');
    }
  },

  // Adicionar documento ao perfil
  uploadDocument: async (formData: FormData): Promise<any> => {
    const response = await api.post('/agent-profile/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  // Remover documento do perfil
  removeDocument: async (documentId: string): Promise<void> => {
    await api.delete(`/agent-profile/documents/${documentId}`);
  }
};
