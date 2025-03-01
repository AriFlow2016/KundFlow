import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { promisify } from 'util';

const randomBytes = promisify(crypto.randomBytes);

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'kundflow-contracts';

export const uploadToS3 = async (file: Express.Multer.File, customerId: string): Promise<{ key: string; url: string }> => {
  const fileExtension = file.originalname.split('.').pop();
  const randomString = (await randomBytes(16)).toString('hex');
  const key = `contracts/${customerId}/${randomString}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      originalName: file.originalname,
    },
  });

  await s3Client.send(command);

  // Generera en signerad URL som är giltig i 1 timme
  const getCommand = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

  return { key, url };
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
};

export const getSignedDownloadUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
