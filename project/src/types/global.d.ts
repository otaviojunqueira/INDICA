declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_URL: string;
    REACT_APP_NAME: string;
    REACT_APP_DESCRIPTION: string;
  }
}

// Tipos para o usuário autenticado
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'evaluator';
  entityId?: string;
}

// Tipos para respostas da API
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}

// Tipos para upload de arquivos
interface UploadedFile {
  name: string;
  type: string;
  path: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Tipos para endereço
interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Variáveis de ambiente
interface ProcessEnv {
  NODE_ENV: 'development' | 'production' | 'test';
  REACT_APP_API_URL: string;
  REACT_APP_MAX_FILE_SIZE: string;
  REACT_APP_MAX_PORTFOLIO_ITEMS: string;
  REACT_APP_CACHE_TTL: string;
  REACT_APP_API_TIMEOUT: string;
}

// Tipos globais da aplicação
declare global {
  interface Window {
    // Adicione propriedades globais do objeto window aqui
  }
} 