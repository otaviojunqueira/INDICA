import api from '../config/axios';

export interface EntityPortal {
  id: string;
  entityId: string;
  title: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  isActive: boolean;
  entity?: {
    id: string;
    name: string;
    type: string;
  };
}

export interface EntityPortalInput {
  entityId: string;
  title: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
}

const entityPortalService = {
  // Listar todos os portais de entidades
  getAllEntityPortals: async (params?: { query?: string; isActive?: boolean }) => {
    const response = await api.get('/entity-portals', { params });
    return response.data;
  },

  // Obter portal de entidade por ID
  getEntityPortalById: async (id: string) => {
    const response = await api.get(`/entity-portals/${id}`);
    return response.data;
  },

  // Obter portal pelo ID da entidade
  getEntityPortalByEntityId: async (entityId: string) => {
    const response = await api.get(`/entity-portals/entity/${entityId}`);
    return response.data;
  },

  // Criar um novo portal de entidade
  createEntityPortal: async (portalData: EntityPortalInput) => {
    const response = await api.post('/entity-portals', portalData);
    return response.data;
  },

  // Atualizar um portal de entidade existente
  updateEntityPortal: async (id: string, portalData: Partial<EntityPortalInput>) => {
    const response = await api.put(`/entity-portals/${id}`, portalData);
    return response.data;
  },

  // Atualizar status de um portal de entidade (ativar/desativar)
  updateEntityPortalStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/entity-portals/${id}/status`, { isActive });
    return response.data;
  },

  // Excluir um portal de entidade
  deleteEntityPortal: async (id: string) => {
    const response = await api.delete(`/entity-portals/${id}`);
    return response.data;
  }
};

export default entityPortalService; 