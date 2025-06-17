import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface ICulturalGroup {
  _id: string;
  name: string;
  description: string;
  foundingDate: Date;
  culturalArea: string[];
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contactEmail: string;
  contactPhone: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    other?: string;
  };
  members: Array<{
    userId: string;
    role: 'admin' | 'member';
    joinedAt: Date;
    user?: {
      name: string;
      email: string;
    };
  }>;
  portfolioLinks?: string[];
  achievements?: string[];
  documents?: Array<{
    _id: string;
    name: string;
    type: string;
    path: string;
    uploadedAt: Date;
    uploadedBy: string;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const culturalGroupService = {
  // Criar novo coletivo
  createGroup: async (groupData: Partial<ICulturalGroup>) => {
    try {
      const response = await axios.post(
        `${API_URL}/cultural-groups`,
        groupData,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao criar coletivo');
    }
  },

  // Atualizar coletivo
  updateGroup: async (groupId: string, groupData: Partial<ICulturalGroup>) => {
    try {
      const response = await axios.put(
        `${API_URL}/cultural-groups/${groupId}`,
        groupData,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao atualizar coletivo');
    }
  },

  // Obter coletivo por ID
  getGroup: async (groupId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/cultural-groups/${groupId}`,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao buscar coletivo');
    }
  },

  // Listar coletivos
  listGroups: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => {
    try {
      const response = await axios.get(
        `${API_URL}/cultural-groups`,
        {
          params,
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao listar coletivos');
    }
  },

  // Adicionar membro ao coletivo
  addMember: async (groupId: string, userId: string, role: 'admin' | 'member' = 'member') => {
    try {
      const response = await axios.post(
        `${API_URL}/cultural-groups/${groupId}/members`,
        { userId, role },
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao adicionar membro');
    }
  },

  // Remover membro do coletivo
  removeMember: async (groupId: string, memberId: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/cultural-groups/${groupId}/members/${memberId}`,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao remover membro');
    }
  },

  // Atualizar papel de um membro
  updateMemberRole: async (groupId: string, memberId: string, role: 'admin' | 'member') => {
    try {
      const response = await axios.put(
        `${API_URL}/cultural-groups/${groupId}/members/${memberId}`,
        { role },
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao atualizar papel do membro');
    }
  }
};