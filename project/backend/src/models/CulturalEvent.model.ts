import mongoose, { Document, Schema } from 'mongoose';

export interface ICulturalEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  city: string;
  state: string;
  eventType: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'finished';
  createdBy: mongoose.Types.ObjectId;
  address?: string;
  website?: string;
  contactInfo?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventTypes = [
  'Assistencial',
  'Cívico',
  'Comercial',
  'Cultural',
  'Empresarial',
  'Esportivo',
  'Folclórico',
  'Gastronômico',
  'Religioso',
  'Social',
  'Técnico',
  'Outros'
];

const categories = [
  'Artístico/Cultural/Folclórico',
  'Científico ou Técnico',
  'Comercial ou Promocional',
  'Ecoturismo',
  'Esportivo',
  'Gastronômico',
  'Junino',
  'Moda',
  'Religioso',
  'Rural',
  'Social/Cívico/Histórico',
  'Outro'
];

const CulturalEventSchema = new Schema<ICulturalEvent>({
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
  endDate: {
    type: Date,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: eventTypes
  },
  category: {
    type: String,
    required: true,
    enum: categories
  },
  status: {
    type: String,
    required: true,
    enum: ['upcoming', 'ongoing', 'finished'],
    default: 'upcoming'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String
  },
  website: {
    type: String
  },
  contactInfo: {
    type: String
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true
});

const CulturalEvent = mongoose.model<ICulturalEvent>('CulturalEvent', CulturalEventSchema);

export default CulturalEvent; 