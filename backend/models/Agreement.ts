import { Schema, model, Document } from 'mongoose';

export interface IAgreement extends Document {
  customerId: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileUrl: string;
  startDate?: Date;
  endDate?: Date;
  monthlyCost?: number;
  phoneNumbers: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  ocrData?: {
    rawText: string;
    confidence: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AgreementSchema = new Schema<IAgreement>(
  {
    customerId: {
      type: String,
      required: true,
      index: true
    },
    fileName: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    monthlyCost: {
      type: Number
    },
    phoneNumbers: [{
      type: String
    }],
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    ocrData: {
      rawText: String,
      confidence: Number
    }
  },
  {
    timestamps: true
  }
);

// Index för att förbättra sökning
AgreementSchema.index({ startDate: 1 });
AgreementSchema.index({ endDate: 1 });
AgreementSchema.index({ status: 1 });
AgreementSchema.index({ createdAt: -1 });

export const Agreement = model<IAgreement>('Agreement', AgreementSchema);
