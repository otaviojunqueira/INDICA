import mongoose, { Document, Schema } from 'mongoose';

export interface IAgentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  // Dados Pessoais
  dateOfBirth: Date;
  gender: string;
  raceEthnicity: string;
  education: string;
  
  // Endereço
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Dados Socioeconômicos
  monthlyIncome: number;
  householdIncome: number;
  householdMembers: number;
  occupation: string;
  workRegime: string;
  
  // Dados Culturais
  culturalArea: string[];
  yearsOfExperience: number;
  portfolioLinks?: string[];
  biography: string;
  
  // Dados de Acessibilidade
  hasDisability: boolean;
  disabilityDetails?: string;
  accessibilityNeeds?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

const AgentProfileSchema = new Schema<IAgentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    // Dados Pessoais
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      required: true,
      trim: true
    },
    raceEthnicity: {
      type: String,
      required: true,
      trim: true
    },
    education: {
      type: String,
      required: true,
      trim: true
    },
    
    // Endereço
    address: {
      street: {
        type: String,
        required: true,
        trim: true
      },
      number: {
        type: String,
        required: true,
        trim: true
      },
      complement: {
        type: String,
        trim: true
      },
      neighborhood: {
        type: String,
        required: true,
        trim: true
      },
      city: {
        type: String,
        required: true,
        trim: true
      },
      state: {
        type: String,
        required: true,
        trim: true
      },
      zipCode: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{5}-\d{3}$/, 'Por favor, forneça um CEP válido no formato XXXXX-XXX']
      }
    },
    
    // Dados Socioeconômicos
    monthlyIncome: {
      type: Number,
      required: true,
      min: 0
    },
    householdIncome: {
      type: Number,
      required: true,
      min: 0
    },
    householdMembers: {
      type: Number,
      required: true,
      min: 1
    },
    occupation: {
      type: String,
      required: true,
      trim: true
    },
    workRegime: {
      type: String,
      required: true,
      trim: true
    },
    
    // Dados Culturais
    culturalArea: [{
      type: String,
      required: true,
      trim: true
    }],
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0
    },
    portfolioLinks: [{
      type: String,
      trim: true,
      match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/, 'Por favor, forneça URLs válidas']
    }],
    biography: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    
    // Dados de Acessibilidade
    hasDisability: {
      type: Boolean,
      required: true,
      default: false
    },
    disabilityDetails: {
      type: String,
      trim: true
    },
    accessibilityNeeds: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true
  }
);

// Validação de idade mínima (18 anos)
AgentProfileSchema.pre('validate', function(next) {
  const now = new Date();
  const eighteenYearsAgo = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
  
  if (this.dateOfBirth > eighteenYearsAgo) {
    this.invalidate('dateOfBirth', 'O agente cultural deve ter pelo menos 18 anos');
  }
  next();
});

export default mongoose.model<IAgentProfile>('AgentProfile', AgentProfileSchema);