// Configurações da API
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configurações de upload
export const UPLOAD_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Configurações de paginação
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Configurações de autenticação
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';

// Configurações de timeout
export const API_TIMEOUT = 30000; // 30 segundos

// Configurações de cache
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Configurações de notificação
export const NOTIFICATION_DURATION = 5000; // 5 segundos

// Configurações de validação
export const MAX_FILE_UPLOADS = 5;
export const MAX_PORTFOLIO_ITEMS = 10;
export const MAX_BIOGRAPHY_LENGTH = 2000;

// URLs públicas
export const PUBLIC_URLS = {
  terms: '/termos-de-uso',
  privacy: '/politica-de-privacidade',
  help: '/ajuda',
  about: '/sobre'
}; 