import api from '../config/axios';

export interface City {
  id: string;
  name: string;
  state: string;
  ibgeCode?: string;
  isCapital: boolean;
  region?: string;
  population?: number;
}

export interface CityInput {
  name: string;
  state: string;
  ibgeCode?: string;
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