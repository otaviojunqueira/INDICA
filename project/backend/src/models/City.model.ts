import mongoose, { Document, Schema } from 'mongoose';

export interface ICity extends Document {
  name: string;
  state: string;
  stateCode: string;
  ibgeCode: string;
  isCapital: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    stateCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2
    },
    ibgeCode: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    isCapital: {
      type: Boolean,
      default: false
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
CitySchema.index({ name: 1, state: 1 }, { unique: true });
CitySchema.index({ stateCode: 1 });
CitySchema.index({ ibgeCode: 1 });

export default mongoose.model<ICity>('City', CitySchema); 