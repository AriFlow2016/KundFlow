import { s3Client } from '../../config/aws-config';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export class S3Service {
  async uploadFile(file: Express.Multer.File, key: string, isTextract: boolean = false): Promise<string> {
    try {
      const bucket = isTextract ? process.env.AWS_S3_TEXTRACT_BUCKET : process.env.AWS_S3_BUCKET;
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3Client.send(command);
      return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  async getDownloadUrl(key: string, isTextract: boolean = false): Promise<string> {
    try {
      const bucket = isTextract ? process.env.AWS_S3_TEXTRACT_BUCKET : process.env.AWS_S3_BUCKET;
      return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error generating URL:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  async deleteFile(key: string, isTextract: boolean = false): Promise<void> {
    try {
      const bucket = isTextract ? process.env.AWS_S3_TEXTRACT_BUCKET : process.env.AWS_S3_BUCKET;
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      console.error('Error deleting from S3:', error);
      throw new Error('Failed to delete file from S3');
    }
  }
}
