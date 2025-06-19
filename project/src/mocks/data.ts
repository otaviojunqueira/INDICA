import { User, IAgentProfile, Notice, Application, CulturalGroup } from '../types';

// Usuário atual simulado
export const currentUser: User = {
  id: '1',
  name: 'José Silva',
  email: 'jose@exemplo.com',
  role: 'agent',
  profileId: '1'
};

// Perfil de agente cultural
export const agentProfile: IAgentProfile = {
  userId: '1',
  dateOfBirth: new Date('1985-07-15'),
  gender: 'masculino',
  raceEthnicity: 'pardo',
  education: 'superior_completo',
  address: {
    street: 'Rua das Artes',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Vila Cultural',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '04567-890'
  },
  monthlyIncome: 3500,
  householdIncome: 5000,
  householdMembers: 2,
  occupation: 'Músico e Produtor Cultural',
  workRegime: 'autonomo',
  culturalArea: ['musica', 'audiovisual'],
  yearsOfExperience: 12,
  biography: 'Músico profissional com 12 anos de experiência em composição e produção musical...',
  hasDisability: false,
  createdAt: new Date('2023-01-16'),
  updatedAt: new Date('2023-05-20')
};

// Coletivo Cultural
export const culturalGroup: CulturalGroup = {
  id: '1',
  name: 'Coletivo Musical Harmonia',
  description: 'Grupo dedicado à fusão de ritmos brasileiros com jazz e música eletrônica',
  foundationDate: new Date('2010-03-20'),
  culturalArea: ['musica', 'educacao'],
  cnpj: '12.345.678/0001-90',
  address: {
    street: 'Rua dos Músicos',
    number: '456',
    complement: 'Sala 12',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567'
  },
  contactEmail: 'contato@coletivoharmonia.com.br',
  contactPhone: '(11) 3456-7890',
  socialMedia: {
    instagram: '@coletivoharmonia',
    facebook: 'facebook.com/coletivoharmonia',
    youtube: 'youtube.com/coletivoharmonia'
  },
  representatives: [
    {
      userId: '1',
      role: 'coordenador',
      isMainContact: true
    }
  ],
  members: [
    {
      name: 'João Silva',
      role: 'Baterista',
      joinedDate: new Date('2010-03-20')
    },
    {
      name: 'Maria Oliveira',
      role: 'Vocalista',
      joinedDate: new Date('2011-05-15')
    }
  ],
  createdAt: new Date('2023-01-16'),
  updatedAt: new Date('2023-05-20')
};

// Usuários simulados
export const users: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@indica.gov.br",
    role: "admin",
  },
  {
    id: "2",
    name: "João Silva",
    email: "joao@email.com",
    role: "agent",
    profileId: "1"
  },
  {
    id: "3",
    name: "Maria Oliveira",
    email: "maria@email.com",
    role: "evaluator",
  }
];

// Editais simulados
export const mockNotices: Notice[] = [
  {
    id: "1",
    title: "Edital de Fomento à Música",
    description: "Apoio a projetos musicais que contribuam para o desenvolvimento cultural local.",
    startDate: "2023-05-01T00:00:00",
    endDate: "2023-06-30T23:59:59",
    maxValue: 50000,
    totalAmount: 500000,
    status: "draft",
    areas: ["Música"],
    city: "São Paulo",
    state: "SP",
    requirements: [
      "Ser pessoa física ou jurídica com atuação cultural comprovada",
      "Residir ou ter sede no estado há pelo menos 2 anos",
      "Apresentar portfólio com trabalhos anteriores"
    ],
    documents: [
      "Documento de identificação",
      "Comprovante de residência",
      "Portfólio",
      "Projeto detalhado",
      "Orçamento detalhado"
    ],
    evaluationCriteria: [
      {
        id: "1",
        name: "Relevância Cultural",
        description: "Avalia a importância do projeto para a cultura local",
        weight: 30
      },
      {
        id: "2",
        name: "Viabilidade Técnica",
        description: "Analisa a exequibilidade do projeto",
        weight: 25
      }
    ],
    steps: [
      {
        id: "1",
        name: "Inscrições",
        description: "Período de envio de propostas",
        startDate: "2023-05-01T00:00:00",
        endDate: "2023-06-30T23:59:59"
      },
      {
        id: "2",
        name: "Avaliação",
        description: "Análise das propostas",
        startDate: "2023-07-01T00:00:00",
        endDate: "2023-07-15T23:59:59"
      }
    ]
  }
];

// Inscrições simuladas
export const mockApplications: Application[] = [
  {
    id: "1",
    noticeId: "1",
    noticeTitle: "Edital de Fomento à Música",
    userId: "2",
    userName: "João Silva",
    title: "Festival de Música Independente",
    description: "Festival que reunirá bandas independentes locais para apresentações ao vivo.",
    requestedValue: 45000,
    counterpart: 5000,
    objectives: "Promover a música independente local",
    targetAudience: "Público geral",
    methodology: "Seleção de bandas, organização de palco e divulgação",
    timeline: "3 meses",
    expectedResults: "Aumento da visibilidade dos artistas locais",
    justification: "Necessidade de espaços para música independente",
    status: "under_review",
    submissionDate: "2023-05-15T14:30:00",
    returnDate: null,
    comments: null,
    budget: [
      {
        id: "1",
        description: "Aluguel de equipamento de som",
        quantity: 1,
        unitValue: 5000,
        totalValue: 5000,
        category: "Infraestrutura"
      }
    ],
    team: [
      {
        id: "1",
        name: "João Silva",
        role: "Coordenador",
        experience: "10 anos de produção cultural"
      }
    ],
    documents: [
      {
        id: "1",
        name: "projeto_detalhado.pdf",
        type: "application/pdf",
        size: 1024000,
        url: "/uploads/projeto_detalhado.pdf"
      },
      {
        id: "2",
        name: "orcamento.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 512000,
        url: "/uploads/orcamento.xlsx"
      }
    ]
  }
];

// Perfis de agentes culturais simulados
export const agentProfiles: IAgentProfile[] = [
  {
    id: "1",
    userId: "2",
    name: "João Silva",
    document: "123.456.789-00",
    birthDate: "1985-03-15",
    phone: "(11) 98765-4321",
    address: {
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    },
    education: "Superior Completo",
    profession: "Produtor Cultural",
    culturalArea: ["Música", "Artes Visuais"],
    bio: "Produtor cultural com 10 anos de experiência em produção de eventos e gestão de projetos culturais.",
    socialMedia: {
      instagram: "@joaosilva",
      facebook: "joaosilva",
      youtube: "joaosilvacultural",
      website: "www.joaosilva.com.br"
    },
    bankInfo: {
      bank: "Banco do Brasil",
      agency: "1234-5",
      account: "12345-6",
      accountType: "Corrente"
    }
  }
];

// Coletivos culturais simulados
export const culturalGroups: CulturalGroup[] = [
  {
    id: "1",
    name: "Coletivo Cultural Raízes",
    description: "Grupo dedicado à preservação e difusão da cultura popular brasileira.",
    foundationDate: "2010-05-20",
    document: "12.345.678/0001-90",
    culturalArea: ["Música", "Dança", "Artesanato"],
    address: {
      street: "Rua dos Artistas",
      number: "456",
      neighborhood: "Vila Cultural",
      city: "São Paulo",
      state: "SP",
      zipCode: "04567-890"
    },
    members: [
      {
        id: "1",
        name: "João Silva",
        role: "Coordenador",
        document: "123.456.789-00"
      },
      {
        id: "2",
        name: "Maria Oliveira",
        role: "Tesoureira",
        document: "987.654.321-00"
      },
      {
        id: "3",
        name: "Pedro Santos",
        role: "Diretor Artístico",
        document: "111.222.333-44"
      }
    ],
    portfolio: "O coletivo já realizou mais de 50 apresentações em diversos festivais e eventos culturais no Brasil.",
    socialMedia: {
      instagram: "@coletivoraizes",
      facebook: "coletivoraizes",
      youtube: "coletivoraizes",
      website: "www.coletivoraizes.org.br"
    },
    bankInfo: {
      bank: "Caixa Econômica",
      agency: "4321-0",
      account: "123456-7",
      accountType: "Corrente"
    }
  }
];
