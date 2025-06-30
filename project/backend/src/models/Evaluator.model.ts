import mongoose, { Document, Schema } from 'mongoose';

export interface IEvaluator extends Document {
  userId: mongoose.Types.ObjectId;
  specialties: string[];
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