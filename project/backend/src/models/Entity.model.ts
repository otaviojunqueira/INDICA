import mongoose, { Document, Schema } from 'mongoose';

export interface IEntity extends Document {
  name: string;
  type: 'municipal' | 'state' | 'federal';
  cnpj: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EntitySchema = new Schema<IEntity>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['municipal', 'state', 'federal'],
      required: true
    },
    cnpj: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, 'Por favor, forneça um CNPJ válido no formato XX.XXX.XXX/XXXX-XX']
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, forneça um email válido']
    },
    contactPhone: {
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

export default mongoose.model<IEntity>('Entity', EntitySchema); 