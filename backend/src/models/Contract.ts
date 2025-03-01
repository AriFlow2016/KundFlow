import mongoose, { Document, Schema } from 'mongoose';

export interface IContract extends Document {
  name: string;
  contractNumber?: string;
  startDate: Date;
  endDate: Date;
  operator?: string;
  status: 'active' | 'expired' | 'terminated';
  monthlyCost: number;
  documentUrl?: string;
  documentName?: string;
  documentKey?: string; 
  customerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<IContract>({
  name: { type: String, required: true },
  contractNumber: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  operator: { type: String },
  status: {
    type: String,
    enum: ['active', 'expired', 'terminated'],
    required: true,
    default: 'active'
  },
  monthlyCost: {
    type: Number,
    required: true,
    min: 0
  },
  documentUrl: { type: String },
  documentName: { type: String },
  documentKey: { type: String },
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Customer',
    required: true,
    index: true
  },
}, {
  timestamps: true,
});

// Index för att snabbt hitta avtal som snart löper ut
ContractSchema.index({ endDate: 1 });

// Automatisk status-uppdatering baserat på datum
ContractSchema.pre('save', function(next) {
  const now = new Date();
  if (this.endDate < now) {
    this.status = 'expired';
  }
  next();
});

// Använd pre('deleteOne') istället för pre('remove')
ContractSchema.pre('deleteOne', { document: true }, async function(next) {
  if (this.documentKey) {
    try {
      // TODO: Implementera S3 dokumentborttagning
      // await deleteFromS3(this.documentKey);
    } catch (error) {
      console.error('Failed to delete document from S3:', error);
    }
  }
  next();
});

export const Contract = mongoose.model<IContract>('Contract', ContractSchema);
