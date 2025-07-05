import mongoose, { Document, Schema } from 'mongoose';

export interface IEvaluator extends Document {
  userId: mongoose.Types.ObjectId;
  entityId: mongoose.Types.ObjectId; // Entidade federada que cadastrou o parecerista
  culturalSector: string; // Setor cultural específico
  specialties: string[]; // Especialidades dentro do setor
  biography: string;
  education: string;
  experience: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluatorSchema = new Schema<IEvaluator>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entityId: {
    type: Schema.Types.ObjectId,
    ref: 'Entity',
    required: true
  },
  culturalSector: {
    type: String,
    required: true,
    enum: [
      'Artes Visuais',
      'Audiovisual',
      'Circo',
      'Dança',
      'Literatura',
      'Música',
      'Teatro',
      'Patrimônio Cultural',
      'Cultura Popular',
      'Artesanato',
      'Outros'
    ]
  },
  specialties: {
    type: [String],
    required: true,
    default: []
  },
  biography: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: true
});

const Evaluator = mongoose.model<IEvaluator>('Evaluator', EvaluatorSchema);

export default Evaluator; 