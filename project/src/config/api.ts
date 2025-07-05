// Configurações da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Endpoints da API
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    PROFILE: `${API_URL}/auth/profile`,
    PASSWORD: `${API_URL}/auth/password`,
  },
  
  // Usuários
  USERS: {
    BASE: `${API_URL}/users`,
    PROFILE: `${API_URL}/users/profile`,
    ENTITIES: `${API_URL}/users/entities`,
    ENTITY_SEARCH: `${API_URL}/users/entities/search`,
  },
  
  // Entidades
  ENTITIES: {
    BASE: `${API_URL}/entities`,
    MANAGEMENT: `${API_URL}/users/entities`,
  },

  // Ente Federado
  ENTITY: {
    BASE: `${API_URL}/entity`,
    PROFILE: `${API_URL}/entity/profile`,
  },
  
  // Editais
  NOTICES: {
    BASE: `${API_URL}/notices`,
  },
  
  // Inscrições
  APPLICATIONS: {
    BASE: `${API_URL}/applications`,
  },
  
  // Avaliações
  EVALUATIONS: {
    BASE: `${API_URL}/evaluations`,
  },

  // Perfil do Agente Cultural
  AGENT_PROFILE: {
    BASE: `${API_URL}/agent-profiles`,
    PUBLIC: `${API_URL}/agent-profiles/public`,
    USER: `${API_URL}/agent-profiles/user`,
  },

  // Coletivos Culturais
  CULTURAL_GROUPS: {
    BASE: `${API_URL}/cultural-groups`,
  },
};

export default API_ENDPOINTS; 