import mongoose, { Document, Schema } from 'mongoose';

export interface INotice extends Document {
  title: string;
  description: string;
  entityId: mongoose.Types.ObjectId;
  cityId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  maxApplicationValue: number;
  minApplicationValue: number;
  status: 'draft' | 'published' | 'closed' | 'canceled';
  categories: string[];
  requirements: string[];
  documents: string[];
  evaluationCriteria: Array<{
    name: string;
    weight: number;
    description: string;
  }>;
  quotas: {
    blackQuota: number;
    indigenousQuota: number;
    disabilityQuota: number;
  };
  accessibility: {
    physical: string[];
    communicational: string[];
    attitudinal: string[];
  };
  stages: Array<{
    name: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }>;
  appealPeriod: {
    selectionAppealDays: number;
    habilitationAppealDays: number;
  };
  habilitationDocuments: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
  budget: {
    totalAmount: number;
    maxValue: number;
    minValue: number;
    allowedExpenses: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    entityId: {
      type: Schema.Types.ObjectId,
      ref: 'Entity',
      required: true
    },
    cityId: {
      type: Schema.Types.ObjectId,
      ref: 'City',
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
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    maxApplicationValue: {
      type: Number,
      required: true,
      min: 0
    },
    minApplicationValue: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed', 'canceled'],
      default: 'draft'
    },
    categories: [{
      type: String,
      trim: true
    }],
    requirements: [{
      type: String,
      trim: true
    }],
    documents: [{
      type: String,
      trim: true
    }],
    evaluationCriteria: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      weight: {
        type: Number,
        required: true,
        min: 0,
        max: 10
      },
      description: {
        type: String,
        required: true
      }
    }],
    quotas: {
      blackQuota: {
        type: Number,
        required: true,
        min: 0,
        default: 0
      },
      indigenousQuota: {
        type: Number,
        required: true,
        min: 0,
        default: 0
      },
      disabilityQuota: {
        type: Number,
        required: true,
        min: 0,
        default: 0
      }
    },
    accessibility: {
      physical: [{
        type: String,
        trim: true
      }],
      communicational: [{
        type: String,
        trim: true
      }],
      attitudinal: [{
        type: String,
        trim: true
      }]
    },
    stages: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }],
    appealPeriod: {
      selectionAppealDays: {
        type: Number,
        required: true,
        min: 3,
        default: 3
      },
      habilitationAppealDays: {
        type: Number,
        required: true,
        min: 3,
        default: 3
      }
    },
    habilitationDocuments: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true
      },
      required: {
        type: Boolean,
        default: true
      }
    }],
    budget: {
      totalAmount: {
        type: Number,
        required: true,
        min: 0
      },
      maxValue: {
        type: Number,
        required: true,
        min: 0
      },
      minValue: {
        type: Number,
        required: true,
        min: 0
      },
      allowedExpenses: [{
        type: String,
        trim: true
      }]
    }
  },
  {
    timestamps: true
  }
);

// Validação para garantir que a data de término seja após a data de início
NoticeSchema.pre('validate', function(next) {
  if (this.startDate && this.endDate && new Date(this.startDate) >= new Date(this.endDate)) {
    this.invalidate('endDate', 'A data de término deve ser após a data de início');
  }
  next();
});

export default mongoose.model<INotice>('Notice', NoticeSchema); 