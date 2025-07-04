import mongoose, { Document, Schema } from 'mongoose';
import { validateCNPJ } from '../utils/validators';

export interface IEntity extends Document {
  name: string;
  type: 'municipal' | 'state' | 'federal';
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
  legalRepresentative: {
    name: string;
    cpf: string;
    position: string;
    email: string;
    phone: string;
  };
  technicalRepresentative: {
    name: string;
    cpf: string;
    position: string;
    email: string;
    phone: string;
  };
  culturalCouncil: {
    name: string;
    lawNumber: string;
    lastElectionDate: Date;
    endOfTermDate: Date;
  };
  culturalFund: {
    name: string;
    lawNumber: string;
    cnpj: string;
  };
  culturalPlan: {
    name: string;
    lawNumber: string;
    startDate: Date;
    endDate: Date;
  };
  bankInfo: {
    bank: string;
    agency: string;
    account: string;
    accountType: 'corrente' | 'poupança';
  };
  documents: {
    officialActAppointment: string;
    identificationDocument: string;
    cpfDocument: string;
    proofOfAddress: string;
    termOfOffice: string;
  };
  isActive: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EntitySchema = new Schema<IEntity>(
  {
    name: {
      type: String,
      required: [true, 'Nome do ente federado é obrigatório'],
      trim: true,
      maxlength: [200, 'Nome não pode ter mais que 200 caracteres']
    },
    type: {
      type: String,
      enum: {
        values: ['municipal', 'state', 'federal'],
        message: '{VALUE} não é um tipo válido'
      },
      required: [true, 'Tipo do ente federado é obrigatório']
    },
    cnpj: {
      type: String,
      required: [true, 'CNPJ é obrigatório'],
      unique: true,
      trim: true,
      validate: {
        validator: validateCNPJ,
        message: 'CNPJ inválido'
      }
    },
    address: {
      street: {
        type: String,
        required: [true, 'Logradouro é obrigatório'],
        trim: true
      },
      number: {
        type: String,
        required: [true, 'Número é obrigatório'],
        trim: true
      },
      complement: {
        type: String,
        trim: true
      },
      neighborhood: {
        type: String,
        required: [true, 'Bairro é obrigatório'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'Cidade é obrigatória'],
        trim: true
      },
      state: {
        type: String,
        required: [true, 'Estado é obrigatório'],
        trim: true,
        length: [2, 'Use a sigla do estado com 2 letras']
      },
      zipCode: {
        type: String,
        required: [true, 'CEP é obrigatório'],
        trim: true,
        match: [/^\d{5}-\d{3}$/, 'CEP inválido. Use o formato: XXXXX-XXX']
      }
    },
    legalRepresentative: {
      name: {
        type: String,
        required: [true, 'Nome do representante legal é obrigatório'],
        trim: true
      },
      cpf: {
        type: String,
        required: [true, 'CPF do representante legal é obrigatório'],
        trim: true,
        match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use o formato: XXX.XXX.XXX-XX']
      },
      position: {
        type: String,
        required: [true, 'Cargo do representante legal é obrigatório'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Email do representante legal é obrigatório'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
      },
      phone: {
        type: String,
        required: [true, 'Telefone do representante legal é obrigatório'],
        trim: true,
        match: [/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido. Use o formato: (XX) XXXXX-XXXX']
      }
    },
    technicalRepresentative: {
      name: {
        type: String,
        required: [true, 'Nome do representante técnico é obrigatório'],
        trim: true
      },
      cpf: {
        type: String,
        required: [true, 'CPF do representante técnico é obrigatório'],
        trim: true,
        match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use o formato: XXX.XXX.XXX-XX']
      },
      position: {
        type: String,
        required: [true, 'Cargo do representante técnico é obrigatório'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Email do representante técnico é obrigatório'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
      },
      phone: {
        type: String,
        required: [true, 'Telefone do representante técnico é obrigatório'],
        trim: true,
        match: [/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido. Use o formato: (XX) XXXXX-XXXX']
      }
    },
    culturalCouncil: {
      name: {
        type: String,
        required: [true, 'Nome do conselho cultural é obrigatório'],
        trim: true
      },
      lawNumber: {
        type: String,
        required: [true, 'Número da lei do conselho cultural é obrigatório'],
        trim: true
      },
      lastElectionDate: {
        type: Date,
        required: [true, 'Data da última eleição é obrigatória']
      },
      endOfTermDate: {
        type: Date,
        required: [true, 'Data do fim do mandato é obrigatória']
      }
    },
    culturalFund: {
      name: {
        type: String,
        required: [true, 'Nome do fundo cultural é obrigatório'],
        trim: true
      },
      lawNumber: {
        type: String,
        required: [true, 'Número da lei do fundo cultural é obrigatório'],
        trim: true
      },
      cnpj: {
        type: String,
        required: [true, 'CNPJ do fundo cultural é obrigatório'],
        trim: true,
        validate: {
          validator: validateCNPJ,
          message: 'CNPJ do fundo cultural inválido'
        }
      }
    },
    culturalPlan: {
      name: {
        type: String,
        required: [true, 'Nome do plano cultural é obrigatório'],
        trim: true
      },
      lawNumber: {
        type: String,
        required: [true, 'Número da lei do plano cultural é obrigatório'],
        trim: true
      },
      startDate: {
        type: Date,
        required: [true, 'Data de início do plano cultural é obrigatória']
      },
      endDate: {
        type: Date,
        required: [true, 'Data de término do plano cultural é obrigatória']
      }
    },
    bankInfo: {
      bank: {
        type: String,
        required: [true, 'Nome do banco é obrigatório'],
        trim: true
      },
      agency: {
        type: String,
        required: [true, 'Agência bancária é obrigatória'],
        trim: true
      },
      account: {
        type: String,
        required: [true, 'Conta bancária é obrigatória'],
        trim: true
      },
      accountType: {
        type: String,
        enum: {
          values: ['corrente', 'poupança'],
          message: '{VALUE} não é um tipo de conta válido'
        },
        required: [true, 'Tipo de conta é obrigatório']
      }
    },
    documents: {
      officialActAppointment: {
        type: String,
        required: [true, 'Ato oficial de nomeação é obrigatório']
      },
      identificationDocument: {
        type: String,
        required: [true, 'Documento de identificação é obrigatório']
      },
      cpfDocument: {
        type: String,
        required: [true, 'Documento de CPF é obrigatório']
      },
      proofOfAddress: {
        type: String,
        required: [true, 'Comprovante de endereço é obrigatório']
      },
      termOfOffice: {
        type: String,
        required: [true, 'Termo de posse é obrigatório']
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: '{VALUE} não é um status válido'
      },
      default: 'pending'
    },
    approvalDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Middleware para validar datas
EntitySchema.pre('save', function(next) {
  // Validar datas do conselho cultural
  if (this.culturalCouncil.lastElectionDate > new Date()) {
    next(new Error('A data da última eleição não pode ser futura'));
  }
  if (this.culturalCouncil.endOfTermDate < this.culturalCouncil.lastElectionDate) {
    next(new Error('A data de fim do mandato deve ser posterior à data da última eleição'));
  }

  // Validar datas do plano cultural
  if (this.culturalPlan.startDate > this.culturalPlan.endDate) {
    next(new Error('A data de início do plano cultural deve ser anterior à data de término'));
  }

  next();
});

export default mongoose.model<IEntity>('Entity', EntitySchema); 