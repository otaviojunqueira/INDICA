import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  noticeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  projectName: string;
  projectDescription: string;
  requestedAmount: number;
  status: 'draft' | 'submitted' | 'evaluation' | 'approved' | 'rejected';
  formData: Record<string, any>;
  documents: Array<{
    name: string;
    path: string;
    uploadedAt: Date;
  }>;
  evaluations: Array<{
    evaluatorId: mongoose.Types.ObjectId;
    criteriaScores: Array<{
      criteriaId: string;
      score: number;
      comments: string;
    }>;
    totalScore: number;
    comments: string;
    evaluatedAt: Date;
  }>;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    noticeId: {
      type: Schema.Types.ObjectId,
      ref: 'Notice',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    projectName: {
      type: String,
      required: true,
      trim: true
    },
    projectDescription: {
      type: String,
      required: true
    },
    requestedAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'evaluation', 'approved', 'rejected'],
      default: 'draft'
    },
    formData: {
      type: Schema.Types.Mixed,
      default: {}
    },
    documents: [{
      name: {
        type: String,
        required: true
      },
      path: {
        type: String,
        required: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    evaluations: [{
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
        score: {
          type: Number,
          required: true,
          min: 0,
          max: 10
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
      evaluatedAt: {
        type: Date,
        default: Date.now
      }
    }],
    submittedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Validação para garantir que o valor solicitado está dentro dos limites do edital
ApplicationSchema.pre('validate', async function(next) {
  try {
    if (this.isModified('requestedAmount') || this.isModified('noticeId')) {
      const Notice = mongoose.model('Notice');
      const notice = await Notice.findById(this.noticeId);
      
      if (notice) {
        if (this.requestedAmount < notice.minApplicationValue) {
          this.invalidate('requestedAmount', `O valor solicitado deve ser no mínimo R$ ${notice.minApplicationValue}`);
        }
        
        if (this.requestedAmount > notice.maxApplicationValue) {
          this.invalidate('requestedAmount', `O valor solicitado deve ser no máximo R$ ${notice.maxApplicationValue}`);
        }
      }
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

export default mongoose.model<IApplication>('Application', ApplicationSchema); 