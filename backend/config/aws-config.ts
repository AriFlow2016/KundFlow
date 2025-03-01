import { S3Client } from '@aws-sdk/client-s3';
import { TextractClient } from '@aws-sdk/client-textract';

// Använd environment variabler istället för hårdkodade värden
export const awsConfig = {
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};

// S3 konfiguration (Stockholm)
const S3_CONFIG_STOCKHOLM = {
  ...awsConfig,
  region: 'eu-north-1'
};

// S3 och Textract konfiguration (Irland)
const IRELAND_CONFIG = {
  ...awsConfig,
  region: 'eu-west-1'
};

export const AWS_CONFIG = S3_CONFIG_STOCKHOLM;

export const S3_CONFIG = {
  bucket: 'ariflow-documents',  // Huvudbucket i Stockholm
  textractBucket: 'ariflow-textract'  // OCR-bucket i Irland
};

// Initiera S3-klient i Stockholm för huvudbucketen
export const s3Client = new S3Client(S3_CONFIG_STOCKHOLM);

// Initiera S3-klient i Irland för Textract-bucketen
export const s3IrelandClient = new S3Client(IRELAND_CONFIG);

// Initiera Textract-klient i Irland
export const textractClient = new TextractClient(IRELAND_CONFIG);
