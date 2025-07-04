import api from '../config/axios';

export interface City {
  _id: string;
  id: string;
  name: string;
  state: string;
  isCapital: boolean;
  entityId?: string;
  region?: string;
  population?: number;
}

export interface CityInput {
  name: string;
  state: string;
  entityId?: string;
  isCapital?: boolean;
  region?: string;
  population?: number;
}

const cityService = {
  // Listar todas as cidades
  getAllCities: async (params?: { query?: string; state?: string; isCapital?: boolean }) => {
    const response = await api.get('/cities', { params });
    return response.data;
  },

  // Obter cidade por ID
  getCityById: async (id: string) => {
    const response = await api.get(`/cities/${id}`);
    return response.data;
  },

  // Listar cidades por estado
  getCitiesByState: async (state: string) => {
    const response = await api.get(`/cities/state/${state}`);
    return response.data;
  },

  // Buscar cidade por nome e estado
  getCityByNameAndState: async (name: string, state: string) => {
    const response = await api.get('/cities/search', { params: { name, state } });
    return response.data;
  },

  // Buscar ou criar cidade
  findOrCreateCity: async (cityData: CityInput) => {
    console.log('Chamando findOrCreateCity com dados:', cityData);
    try {
      const response = await api.post('/cities/find-or-create', cityData);
      console.log('Resposta de findOrCreateCity:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro em findOrCreateCity:', error);
      throw error;
    }
  },

  // Criar uma nova cidade
  createCity: async (cityData: CityInput) => {
    const response = await api.post('/cities', cityData);
    return response.data;
  },

  // Atualizar uma cidade existente
  updateCity: async (id: string, cityData: Partial<CityInput>) => {
    const response = await api.put(`/cities/${id}`, cityData);
    return response.data;
  },

  // Excluir uma cidade
  deleteCity: async (id: string) => {
    const response = await api.delete(`/cities/${id}`);
    return response.data;
  }
};

export default cityService; 