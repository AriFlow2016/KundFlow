import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CONFIG } from '../config/aws-config';

export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: S3_CONFIG.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await this.s3Client.send(command);
    return key;
  }

  async generatePresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }
}
