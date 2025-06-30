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
    }]
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