import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { s3Client } from '../../config/aws-config';

export class S3Service {
  async uploadFile(filePath: string, key: string): Promise<string> {
    try {
      const fileStream = createReadStream(filePath);
      
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: fileStream
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key
      };

      await s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      console.error('Error deleting from S3:', error);
      throw new Error('Failed to delete file from S3');
    }
  }
}
