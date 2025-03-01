import { S3Client } from '@aws-sdk/client-s3';
import { TextractClient } from '@aws-sdk/client-textract';
import { fromEnv } from '@aws-sdk/credential-providers';

// Grundkonfiguration
const getAwsConfig = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials are not configured');
  }

  return {
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  };
};

// S3 konfiguration (Stockholm)
export const S3_CONFIG_STOCKHOLM = {
  region: 'eu-north-1',
  credentials: fromEnv()
};

// S3 och Textract konfiguration (Irland)
export const S3_CONFIG_IRELAND = {
  region: 'eu-west-1',
  credentials: fromEnv()
};

export const AWS_CONFIG = S3_CONFIG_STOCKHOLM;

export const S3_CONFIG = {
  bucket: 'ariflow-documents',
  textractBucket: 'ariflow-textract'
};

// Initiera S3-klient i Stockholm för huvudbucketen
export const s3Client = new S3Client(S3_CONFIG_STOCKHOLM);

// Initiera S3-klient i Irland för Textract
export const s3ClientIreland = new S3Client(S3_CONFIG_IRELAND);

// Initiera Textract-klient i Irland
export const textractClient = new TextractClient(S3_CONFIG_IRELAND);
