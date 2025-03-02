import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Customer } from '@prisma/client';
import slugify from 'slugify';

export class S3CustomerService {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    const region = process.env.AWS_REGION || 'eu-north-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    
    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials not configured');
    }

    console.log('Initializing S3 client with region:', region);
    console.log('Using bucket:', process.env.AWS_S3_BUCKET);
    
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
    
    this.bucket = process.env.AWS_S3_BUCKET || 'kundflow-documents';
  }

  private getCustomerPrefix(customer: Customer): string {
    const safeName = slugify(customer.name, {
      lower: true,
      strict: true,
      locale: 'sv'
    });
    console.log('Generated safe customer name:', safeName);
    return `kund-dokument/${safeName}`;
  }

  async createCustomerFolder(customer: Customer): Promise<string> {
    try {
      const prefix = this.getCustomerPrefix(customer);
      console.log('Creating customer folder with prefix:', prefix);
      
      // Skapa en tom fil som markör för mappen
      const folderCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: `${prefix}/.folder`,
        Body: ''
      });

      console.log('Sending folder creation command...');
      await this.s3Client.send(folderCommand);
      console.log('Folder creation successful');

      // Skapa och ladda upp loggfilen med kunddata
      const logFileName = `${prefix}/${slugify(customer.name, { lower: true })}_info.json`;
      console.log('Creating log file:', logFileName);
      
      const logCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: logFileName,
        Body: JSON.stringify(customer, null, 2),
        ContentType: 'application/json',
        Metadata: {
          'Content-Type': 'application/json',
          'Created-At': new Date().toISOString()
        }
      });

      console.log('Sending log file creation command...');
      await this.s3Client.send(logCommand);
      console.log('Log file creation successful');

      return prefix;
    } catch (error) {
      console.error('Detailed error creating customer folder in S3:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create customer folder in S3: ${error.message}`);
      }
      throw new Error('Failed to create customer folder in S3: Unknown error');
    }
  }

  async uploadCustomerDocument(
    customer: Customer,
    file: Express.Multer.File,
    documentType: string
  ): Promise<string> {
    try {
      const prefix = this.getCustomerPrefix(customer);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safeFileName = slugify(file.originalname, { lower: true });
      const key = `${prefix}/dokument/${documentType}/${timestamp}_${safeFileName}`;

      console.log('Uploading customer document with key:', key);
      
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          'Original-Name': file.originalname,
          'Document-Type': documentType,
          'Uploaded-At': new Date().toISOString()
        }
      });

      console.log('Sending upload command...');
      await this.s3Client.send(uploadCommand);
      console.log('Upload successful');

      return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Detailed error uploading customer document to S3:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to upload document to S3: ${error.message}`);
      }
      throw new Error('Failed to upload document to S3: Unknown error');
    }
  }

  async updateCustomerLog(customer: Customer): Promise<void> {
    try {
      const prefix = this.getCustomerPrefix(customer);
      const logFileName = `${prefix}/${slugify(customer.name, { lower: true })}_info.json`;

      console.log('Updating log file:', logFileName);
      
      const logCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: logFileName,
        Body: JSON.stringify(customer, null, 2),
        ContentType: 'application/json',
        Metadata: {
          'Content-Type': 'application/json',
          'Updated-At': new Date().toISOString()
        }
      });

      console.log('Sending log file update command...');
      await this.s3Client.send(logCommand);
      console.log('Log file update successful');
    } catch (error) {
      console.error('Detailed error updating customer log in S3:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to update customer log in S3: ${error.message}`);
      }
      throw new Error('Failed to update customer log in S3: Unknown error');
    }
  }

  async checkCustomerFolderExists(customer: Customer): Promise<boolean> {
    try {
      const prefix = this.getCustomerPrefix(customer);
      console.log('Checking if customer folder exists with prefix:', prefix);
      
      const headCommand = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: `${prefix}/.folder`
      });

      console.log('Sending head command...');
      await this.s3Client.send(headCommand);
      console.log('Customer folder exists');

      return true;
    } catch (error) {
      console.log('Customer folder does not exist');
      return false;
    }
  }
}
