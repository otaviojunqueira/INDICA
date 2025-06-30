import { api } from '../config/axios';
import API_ENDPOINTS from '../config/api';
import { IAgentProfile } from '../types';

export const agentProfileService = {
  // Obter perfil do agente
  getProfile: async (): Promise<IAgentProfile> => {
    try {
      const response = await api.get(API_ENDPOINTS.AGENT_PROFILE.BASE);
      // Verificar se é um novo perfil
      if (response.data.isNewProfile) {
        console.log('Recebido perfil novo (vazio)');
      }
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar perfil do agente:', error);
      
      // Criar um perfil vazio caso ocorra erro
      const emptyProfile: IAgentProfile = {
        userId: '0',
        dateOfBirth: new Date('2000-01-01'),
        gender: 'prefiro_nao_informar',
        raceEthnicity: 'prefiro_nao_informar',
        education: 'medio_completo',
        address: {
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '00000-000'
        },
        monthlyIncome: 0,
        householdIncome: 0,
        householdMembers: 1,
        occupation: '',
        workRegime: '',
        culturalArea: ['outro'],
        yearsOfExperience: 0,
        biography: '',
        hasDisability: false,
        hasCulturalGroup: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return emptyProfile;
    }
  },

  // Obter perfil do agente por ID de usuário
  getProfileByUserId: async (userId: string): Promise<IAgentProfile> => {
    try {
      const response = await api.get(`${API_ENDPOINTS.AGENT_PROFILE.USER}/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar perfil do agente:', error);
      throw new Error('Não foi possível carregar o perfil do agente cultural');
    }
  },

  // Salvar novo perfil do agente
  saveProfile: async (profileData: Partial<IAgentProfile>): Promise<IAgentProfile> => {
    try {
      const response = await api.post(API_ENDPOINTS.AGENT_PROFILE.BASE, profileData);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao salvar perfil do agente:', error);
      throw new Error('Não foi possível salvar o perfil do agente cultural');
    }
  },

  // Atualizar perfil do agente
  updateProfile: async (userId: string, profileData: Partial<IAgentProfile>): Promise<IAgentProfile> => {
    try {
      const response = await api.put(`${API_ENDPOINTS.AGENT_PROFILE.BASE}/${userId}`, profileData);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil do agente:', error);
      throw new Error('Não foi possível atualizar o perfil do agente cultural');
    }
  },

  // Adicionar documento ao perfil
  uploadDocument: async (formData: FormData): Promise<{ url: string; filename: string; id: string }> => {
    try {
      const response = await api.post(`${API_ENDPOINTS.AGENT_PROFILE.BASE}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao fazer upload de documento:', error);
      throw new Error('Não foi possível fazer upload do documento');
    }
  },

  // Remover documento do perfil
  removeDocument: async (documentId: string): Promise<void> => {
    try {
      await api.delete(`${API_ENDPOINTS.AGENT_PROFILE.BASE}/documents/${documentId}`);
    } catch (error) {
      console.error('Erro ao remover documento:', error);
      throw new Error('Não foi possível remover o documento');
    }
  }
};
