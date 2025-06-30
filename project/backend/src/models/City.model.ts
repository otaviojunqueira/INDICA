import mongoose, { Document, Schema } from 'mongoose';

export interface ICity extends Document {
  name: string;
  state: string;
  ibgeCode?: string;
  isCapital: boolean;
  region?: string;
  population?: number;
  entityId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true,
    enum: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
  },
  ibgeCode: {
    type: String,
    trim: true
  },
  isCapital: {
    type: Boolean,
    default: false,
    required: true
  },
  region: {
    type: String,
    enum: ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']
  },
  population: {
    type: Number
  },
  entityId: {
    type: Schema.Types.ObjectId,
    ref: 'Entity',
    required: true
  }
}, {
  timestamps: true
});

const City = mongoose.model<ICity>('City', CitySchema);

export default City; 