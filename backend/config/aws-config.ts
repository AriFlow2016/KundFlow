import { fromEnv } from '@aws-sdk/credential-providers';
import { S3Client } from '@aws-sdk/client-s3';
import { TextractClient } from '@aws-sdk/client-textract';

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

export const S3_CONFIG = {
  region: process.env.AWS_REGION || 'eu-north-1',
  bucket: process.env.AWS_S3_BUCKET || 'kundflow-contracts',
  textractBucket: process.env.AWS_TEXTRACT_BUCKET || 'kundflow-textract'
};

// S3 Client för Stockholm-regionen (eu-north-1)
export const s3Client = new S3Client({
  region: S3_CONFIG.region,
  credentials: fromEnv()
});

// Textract Client för Ireland-regionen (eu-west-1)
export const textractClient = new TextractClient({
  region: 'eu-west-1', // Textract är inte tillgängligt i Stockholm
  credentials: fromEnv()
});
