import { S3Client } from '@aws-sdk/client-s3';
import { TextractClient } from '@aws-sdk/client-textract';

// Grundläggande AWS-konfiguration
const awsConfig = {
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
};

// S3-klient för fillagring
export const s3Client = new S3Client(awsConfig);

// Textract-klient för OCR
export const textractClient = new TextractClient(awsConfig);

// S3-bucket konfiguration
export const S3_CONFIG = {
  bucket: process.env.AWS_S3_BUCKET || 'kundflow-documents',
  baseUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`
};

// Validera AWS-konfiguration
export const validateAwsConfig = () => {
  const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_S3_BUCKET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Saknade AWS-miljövariabler: ${missingVars.join(', ')}`);
  }
};
