import { api } from '../config/axios';
import API_ENDPOINTS from '../config/api';

export interface IEntity {
  name: string;
  type: 'municipal' | 'state' | 'federal';
  cnpj: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  legalRepresentative: {
    name: string;
    cpf: string;
    position: string;
    email: string;
    phone: string;
  };
  technicalRepresentative: {
    name: string;
    cpf: string;
    position: string;
    email: string;
    phone: string;
  };
  culturalCouncil: {
    name: string;
    lawNumber: string;
    lastElectionDate: Date;
    endOfTermDate: Date;
  };
  culturalFund: {
    name: string;
    lawNumber: string;
    cnpj: string;
  };
  culturalPlan: {
    name: string;
    lawNumber: string;
    startDate: Date;
    endDate: Date;
  };
}

interface Entity {
  _id: string;
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  cityId: string;
  isActive: boolean;
  responsiblePerson: string;
  position: string;
  institutionalPhone: string;
  createdAt: string;
  updatedAt: string;
  city?: {
    name: string;
    state: string;
  };
}

interface EntityUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  responsiblePerson?: string;
  position?: string;
  institutionalPhone?: string;
  isActive?: boolean;
}

export const entityService = {
  // Obter perfil do ente federado
  getProfile: async (): Promise<IEntity> => {
    try {
      const response = await api.get(API_ENDPOINTS.ENTITY.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perfil do ente federado:', error);
      throw new Error('Não foi possível carregar o perfil do ente federado');
    }
  },

  // Atualizar perfil do ente federado
  updateProfile: async (data: Partial<IEntity>): Promise<IEntity> => {
    try {
      const response = await api.put(API_ENDPOINTS.ENTITY.PROFILE, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil do ente federado:', error);
      throw new Error('Não foi possível atualizar o perfil do ente federado');
    }
  },

  // Listar todos os entes federados
  getAllEntities: async (): Promise<Entity[]> => {
    const response = await api.get(API_ENDPOINTS.USERS.ENTITIES);
    return response.data;
  },

  // Obter um ente federado específico
  getEntity: async (id: string): Promise<Entity> => {
    const response = await api.get(`${API_ENDPOINTS.USERS.ENTITIES}/${id}`);
    return response.data;
  },

  // Atualizar um ente federado
  updateEntity: async (id: string, data: EntityUpdateData): Promise<Entity> => {
    const response = await api.put(`${API_ENDPOINTS.USERS.ENTITIES}/${id}`, data);
    return response.data;
  },

  // Ativar/Desativar um ente federado
  toggleEntityStatus: async (id: string, isActive: boolean): Promise<Entity> => {
    const response = await api.patch(`${API_ENDPOINTS.USERS.ENTITIES}/${id}/status`, { isActive });
    return response.data;
  },

  // Buscar entes federados com filtros
  searchEntities: async (filters: {
    name?: string;
    state?: string;
    isActive?: boolean;
  }): Promise<Entity[]> => {
    const response = await api.get(API_ENDPOINTS.USERS.ENTITY_SEARCH, { params: filters });
    return response.data;
  }
};

export default entityService;
export type { Entity, EntityUpdateData }; 