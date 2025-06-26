export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileId?: string;
}

export type UserRole = 'admin' | 'agent' | 'evaluator';

export interface IAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IAgentProfile {
  // Dados Pessoais
  userId: string;
  dateOfBirth: Date;
  gender: string;
  raceEthnicity: string;
  education: string;

  // Endereço
  address: IAddress;

  // Dados Socioeconômicos
  monthlyIncome: number;
  householdIncome: number;
  householdMembers: number;
  occupation: string;
  workRegime: string;

  // Dados Culturais
  culturalArea: string[];
  yearsOfExperience: number;
  biography: string;
  portfolio?: string[];
  hasCulturalGroup: boolean;

  // Dados de Acessibilidade
  hasDisability: boolean;
  disabilityDetails?: string;
  accessibilityNeeds?: string[];

  // Metadados
  createdAt: Date;
  updatedAt: Date;
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
  startDate: string;
  endDate: string;
  maxValue?: number;
  totalAmount: number;
  status: 'draft' | 'open' | 'closed' | 'evaluation' | 'finished';
  areas: string[];
  city?: string;
  state?: string;
  requirements: string[];
  documents: string[];
  evaluationCriteria: {
    id: string;
    name: string;
    description: string;
    weight: number;
  }[];
  steps: {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  }[];
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
  title: string;
  description: string;
  noticeId: string;
  noticeTitle: string;
  userId: string;
  userName?: string;
  culturalGroupId?: string;
  culturalGroupName?: string;
  submissionDate: string;
  status: ApplicationStatus;
  requestedValue: number;
  counterpart: number;
  objectives: string;
  targetAudience: string;
  methodology: string;
  timeline: string;
  expectedResults: string;
  justification: string;
  returnDate: string | null;
  comments: string | null;
  budget: BudgetItem[];
  team: TeamMember[];
  documents: DocumentInfo[];
  evaluations?: EvaluationInfo[];
}

export type ApplicationStatus = 'draft' | 'under_review' | 'approved' | 'rejected' | 'pending_adjustment';

export interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
}

export interface CulturalGroupMember {
  name: string;
  role: string;
  joinedDate: Date;
}

export interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface EvaluationInfo {
  id: string;
  evaluatorId: string;
  evaluatorName: string;
  date: string;
  score: number;
  comments: string;
  status: 'approved' | 'rejected' | 'pending_adjustment';
  criteriaScores: {
    criteriaId: string;
    criteriaName: string;
    score: number;
    maxScore: number;
    comments?: string;
  }[];
}

export interface Evaluation {
  id: string;
  applicationId: string;
  evaluatorId: string;
  date: string;
  status: 'pending' | 'completed';
  score: number;
  comments: string;
  result: 'approved' | 'rejected' | 'pending_adjustment';
  criteriaScores: {
    criteriaId: string;
    score: number;
    comments?: string;
  }[];
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
  createdAt: string;
  link?: string;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  type: 'notice' | 'application' | 'evaluation' | 'user';
  createdAt: string;
  createdBy: string;
  data: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface CulturalGroup {
  id: string;
  name: string;
  description: string;
  foundationDate: Date;
  culturalArea: string[];
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
  contactEmail: string;
  contactPhone: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  representatives: Array<{
    userId: string;
    role: string;
    isMainContact: boolean;
  }>;
  members: CulturalGroupMember[];
  createdAt: Date;
  updatedAt: Date;
}