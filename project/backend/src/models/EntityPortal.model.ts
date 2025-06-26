import mongoose, { Document, Schema } from 'mongoose';

export interface IEntityPortal extends Document {
  entityId: mongoose.Types.ObjectId;
  
  // Estrutura Organizacional
  organizationalStructure: {
    departments: Array<{
      name: string;
      description: string;
      responsibilities: string[];
      contacts: string[];
    }>;
  };
  
  // Receitas e Despesas
  finances: {
    revenues: Array<{
      year: number;
      quarter: number;
      source: string;
      amount: number;
      description: string;
    }>;
    expenses: Array<{
      year: number;
      quarter: number;
      category: string;
      amount: number;
      description: string;
    }>;
  };
  
  // Licitações e Contratos
  procurement: {
    bids: Array<{
      number: string;
      type: string;
      object: string;
      openingDate: Date;
      status: string;
      documents: string[];
    }>;
    contracts: Array<{
      number: string;
      supplier: string;
      object: string;
      value: number;
      startDate: Date;
      endDate: Date;
      documents: string[];
    }>;
  };
  
  // Servidores
  staff: Array<{
    position: string;
    quantity: number;
    salaryRange: {
      min: number;
      max: number;
    };
  }>;
  
  // Programas e Projetos
  programs: Array<{
    name: string;
    description: string;
    objectives: string[];
    startDate: Date;
    endDate: Date;
    budget: number;
    results: string[];
    documents: string[];
  }>;
  
  // Relatórios e Documentos
  reports: Array<{
    title: string;
    type: string;
    publishDate: Date;
    fileUrl: string;
    description: string;
  }>;
  
  // Legislação
  legislation: Array<{
    title: string;
    number: string;
    date: Date;
    description: string;
    fileUrl: string;
  }>;
  
  // Calendário Cultural
  culturalCalendar: Array<{
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    type: 'official' | 'counterpart' | 'commemorative' | 'training' | 'political';
    contact: string;
  }>;
  
  // Ouvidoria
  ombudsman: {
    contacts: string[];
    channels: string[];
    responsibleName: string;
    responsibleEmail: string;
    responsiblePhone: string;
  };
  
  // Perguntas Frequentes
  faq: Array<{
    question: string;
    answer: string;
    category: string;
  }>;
  
  // Dados Abertos
  openData: Array<{
    title: string;
    description: string;
    format: string;
    updateFrequency: string;
    lastUpdate: Date;
    downloadUrl: string;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}

const EntityPortalSchema = new Schema<IEntityPortal>(
  {
    entityId: {
      type: Schema.Types.ObjectId,
      ref: 'Entity',
      required: true,
      unique: true
    },
    
    // Estrutura Organizacional
    organizationalStructure: {
      departments: [{
        name: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        responsibilities: [String],
        contacts: [String]
      }]
    },
    
    // Receitas e Despesas
    finances: {
      revenues: [{
        year: {
          type: Number,
          required: true
        },
        quarter: {
          type: Number,
          required: true,
          min: 1,
          max: 4
        },
        source: {
          type: String,
          required: true
        },
        amount: {
          type: Number,
          required: true
        },
        description: String
      }],
      expenses: [{
        year: {
          type: Number,
          required: true
        },
        quarter: {
          type: Number,
          required: true,
          min: 1,
          max: 4
        },
        category: {
          type: String,
          required: true
        },
        amount: {
          type: Number,
          required: true
        },
        description: String
      }]
    },
    
    // Licitações e Contratos
    procurement: {
      bids: [{
        number: {
          type: String,
          required: true
        },
        type: {
          type: String,
          required: true
        },
        object: {
          type: String,
          required: true
        },
        openingDate: {
          type: Date,
          required: true
        },
        status: {
          type: String,
          required: true
        },
        documents: [String]
      }],
      contracts: [{
        number: {
          type: String,
          required: true
        },
        supplier: {
          type: String,
          required: true
        },
        object: {
          type: String,
          required: true
        },
        value: {
          type: Number,
          required: true
        },
        startDate: {
          type: Date,
          required: true
        },
        endDate: {
          type: Date,
          required: true
        },
        documents: [String]
      }]
    },
    
    // Servidores
    staff: [{
      position: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      salaryRange: {
        min: {
          type: Number,
          required: true
        },
        max: {
          type: Number,
          required: true
        }
      }
    }],
    
    // Programas e Projetos
    programs: [{
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      objectives: [String],
      startDate: {
        type: Date,
        required: true
      },
      endDate: Date,
      budget: Number,
      results: [String],
      documents: [String]
    }],
    
    // Relatórios e Documentos
    reports: [{
      title: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      publishDate: {
        type: Date,
        required: true
      },
      fileUrl: {
        type: String,
        required: true
      },
      description: String
    }],
    
    // Legislação
    legislation: [{
      title: {
        type: String,
        required: true
      },
      number: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      description: String,
      fileUrl: {
        type: String,
        required: true
      }
    }],
    
    // Calendário Cultural
    culturalCalendar: [{
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      startDate: {
        type: Date,
        required: true
      },
      endDate: Date,
      location: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['official', 'counterpart', 'commemorative', 'training', 'political'],
        required: true
      },
      contact: String
    }],
    
    // Ouvidoria
    ombudsman: {
      contacts: [String],
      channels: [String],
      responsibleName: {
        type: String,
        required: true
      },
      responsibleEmail: {
        type: String,
        required: true
      },
      responsiblePhone: {
        type: String,
        required: true
      }
    },
    
    // Perguntas Frequentes
    faq: [{
      question: {
        type: String,
        required: true
      },
      answer: {
        type: String,
        required: true
      },
      category: String
    }],
    
    // Dados Abertos
    openData: [{
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      format: {
        type: String,
        required: true
      },
      updateFrequency: String,
      lastUpdate: {
        type: Date,
        required: true
      },
      downloadUrl: {
        type: String,
        required: true
      }
    }]
  },
  {
    timestamps: true
  }
);

// Índices para melhorar a performance das consultas
EntityPortalSchema.index({ entityId: 1 });

export default mongoose.model<IEntityPortal>('EntityPortal', EntityPortalSchema);
