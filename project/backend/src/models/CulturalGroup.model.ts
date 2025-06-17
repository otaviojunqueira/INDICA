import mongoose, { Document, Schema } from 'mongoose';

export interface ICulturalGroup extends Document {
  name: string;
  description: string;
  foundingDate: Date;
  culturalArea: string[];
  
  // Endereço do Coletivo
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Dados de Contato
  contactEmail: string;
  contactPhone: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    other?: string;
  };
  
  // Membros
  members: Array<{
    userId: mongoose.Types.ObjectId;
    role: 'admin' | 'member';
    joinedAt: Date;
  }>;
  
  // Portfólio
  portfolioLinks?: string[];
  achievements?: string[];
  
  // Documentos
  documents?: Array<{
    name: string;
    type: string;
    path: string;
    uploadedAt: Date;
    uploadedBy: mongoose.Types.ObjectId;
  }>;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CulturalGroupSchema = new Schema<ICulturalGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    foundingDate: {
      type: Date,
      required: true
    },
    culturalArea: [{
      type: String,
      required: true,
      trim: true
    }],
    
    // Endereço do Coletivo
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
    
    // Dados de Contato
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, forneça um email válido']
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true
    },
    socialMedia: {
      facebook: {
        type: String,
        trim: true
      },
      instagram: {
        type: String,
        trim: true
      },
      youtube: {
        type: String,
        trim: true
      },
      other: {
        type: String,
        trim: true
      }
    },
    
    // Membros
    members: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      role: {
        type: String,
        enum: ['admin', 'member'],
        required: true
      },
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Portfólio
    portfolioLinks: [{
      type: String,
      trim: true,
      match: [/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/, 'Por favor, forneça URLs válidas']
    }],
    achievements: [{
      type: String,
      trim: true
    }],
    
    // Documentos
    documents: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      type: {
        type: String,
        required: true,
        trim: true
      },
      path: {
        type: String,
        required: true,
        trim: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      },
      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }],
    
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Validação para garantir que há pelo menos um admin no grupo
CulturalGroupSchema.pre('save', function(next) {
  const hasAdmin = this.members.some(member => member.role === 'admin');
  if (!hasAdmin) {
    this.invalidate('members', 'O coletivo deve ter pelo menos um administrador');
  }
  next();
});

export default mongoose.model<ICulturalGroup>('CulturalGroup', CulturalGroupSchema);