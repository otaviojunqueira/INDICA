import mongoose, { Document, Schema } from 'mongoose';

export interface IEvaluation extends Document {
  applicationId: mongoose.Types.ObjectId;
  evaluatorId: mongoose.Types.ObjectId;
  criteriaScores: Array<{
    criteriaId: string;
    name: string;
    score: number;
    weight: number;
    comments: string;
  }>;
  totalScore: number;
  comments: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluationSchema = new Schema<IEvaluation>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true
    },
    evaluatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    criteriaScores: [{
      criteriaId: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      score: {
        type: Number,
        min: 0,
        max: 10
      },
      weight: {
        type: Number,
        required: true
      },
      comments: {
        type: String,
        default: ''
      }
    }],
    totalScore: {
      type: Number,
      default: 0
    },
    comments: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Calcular a pontuação total quando as pontuações dos critérios são alteradas
EvaluationSchema.pre('save', function(next) {
  if (this.isModified('criteriaScores')) {
    let totalScore = 0;
    let totalWeight = 0;
    
    this.criteriaScores.forEach(criteria => {
      if (criteria.score !== undefined) {
        totalScore += criteria.score * criteria.weight;
        totalWeight += criteria.weight;
      }
    });
    
    if (totalWeight > 0) {
      this.totalScore = parseFloat((totalScore / totalWeight).toFixed(2));
    }
    
    // Se todas as pontuações estiverem preenchidas, marcar como concluído
    const allScoresCompleted = this.criteriaScores.every(criteria => 
      criteria.score !== undefined && criteria.score !== null
    );
    
    if (allScoresCompleted && this.status !== 'completed') {
      this.status = 'completed';
      this.completedAt = new Date();
    }
  }
  
  next();
});

export default mongoose.model<IEvaluation>('Evaluation', EvaluationSchema); 