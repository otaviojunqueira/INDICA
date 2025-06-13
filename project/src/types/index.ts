export interface User {
  id: string;
  cpfCnpj: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'agent' | 'evaluator';
  entityId?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CulturalAgent extends User {
  role: 'agent';
  artisticName?: string;
  culturalArea: string[];
  socialData: {
    income: string;
    education: string;
    ethnicity: string;
    gender: string;
    disability: boolean;
  };
  professionalData: {
    experience: string;
    portfolio: string;
    achievements: string[];
  };
}

export interface Entity {
  id: string;
  name: string;
  type: 'municipal' | 'state' | 'federal';
  cnpj: string;
  address: string;
  contact: {
    email: string;
    phone: string;
  };
  isActive: boolean;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  entityId: string;
  category: string;
  budget: number;
  openingDate: Date;
  closingDate: Date;
  evaluationDate: Date;
  resultDate: Date;
  status: 'draft' | 'open' | 'evaluation' | 'result' | 'closed';
  requirements: string[];
  documents: string[];
  fields: FormField[];
  attachments: Attachment[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'file';
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface Application {
  id: string;
  noticeId: string;
  agentId: string;
  projectTitle: string;
  projectDescription: string;
  requestedAmount: number;
  status: 'draft' | 'submitted' | 'under_evaluation' | 'approved' | 'rejected' | 'in_appeal';
  submittedAt: Date;
  evaluations: Evaluation[];
  documents: Attachment[];
  formData: Record<string, any>;
}

export interface Evaluation {
  id: string;
  applicationId: string;
  evaluatorId: string;
  score: number;
  comments: string;
  criteria: {
    [key: string]: {
      score: number;
      comment: string;
    };
  };
  submittedAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface Report {
  id: string;
  title: string;
  type: 'notice' | 'agent' | 'evaluation' | 'financial';
  filters: Record<string, any>;
  data: any[];
  generatedAt: Date;
  generatedBy: string;
}