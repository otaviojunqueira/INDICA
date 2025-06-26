import mongoose, { Document, Schema } from 'mongoose';

export interface IEvaluator extends Document {
  userId: mongoose.Types.ObjectId;
  entityId: mongoose.Types.ObjectId;
  specialties: string[];
  biography: string;
  education: string;
  experience: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluatorSchema = new Schema<IEvaluator>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    entityId: {
      type: Schema.Types.ObjectId,
      ref: 'Entity',
      required: true
    },
    specialties: [{
      type: String,
      required: true,
      trim: true
    }],
    biography: {
      type: String,
      required: true,
      trim: true
    },
    education: {
      type: String,
      required: true,
      trim: true
    },
    experience: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Índices para melhorar a performance das consultas
EvaluatorSchema.index({ userId: 1 });
EvaluatorSchema.index({ entityId: 1 });
EvaluatorSchema.index({ specialties: 1 });

export default mongoose.model<IEvaluator>('Evaluator', EvaluatorSchema); 