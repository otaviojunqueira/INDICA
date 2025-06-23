declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

// Extensão do ImportMeta para ambiente Vite
interface ImportMeta {
  env: {
    VITE_API_URL: string;
    VITE_MAX_FILE_SIZE: string;
    VITE_MAX_PORTFOLIO_ITEMS: string;
    VITE_CACHE_TTL: string;
    VITE_API_TIMEOUT: string;
    [key: string]: string | boolean | undefined;
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
interface ApiResponse<T = unknown> {
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

// Tipos globais da aplicação
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
} 