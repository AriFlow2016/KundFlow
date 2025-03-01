import { 
  TextractClient, 
  StartDocumentTextDetectionCommand, 
  GetDocumentTextDetectionCommand,
  TextractClientConfig,
  DocumentLocation,
  GetDocumentTextDetectionCommandOutput,
  BlockType
} from "@aws-sdk/client-textract";
import { S3Service } from './s3Service';
import { Express } from 'express';

interface TextractBlock {
  BlockType?: string;
  Text?: string;
  Confidence?: number;
}

export class TextractService {
  private textractClient: TextractClient;
  private s3Service: S3Service;

  constructor() {
    const config: TextractClientConfig = {
      region: process.env.AWS_REGION || 'eu-north-1'
    };
    this.textractClient = new TextractClient(config);
    this.s3Service = new S3Service();
  }

  async processDocument(file: Express.Multer.File, key: string): Promise<string> {
    try {
      // Upload to S3 first (in textract bucket)
      await this.s3Service.uploadFile(file, key, true);

      // Start Textract job
      const documentLocation: DocumentLocation = {
        S3Object: {
          Bucket: process.env.AWS_S3_TEXTRACT_BUCKET,
          Name: key
        }
      };

      const startCommand = new StartDocumentTextDetectionCommand({
        DocumentLocation: documentLocation
      });

      const startResponse = await this.textractClient.send(startCommand);
      
      if (!startResponse.JobId) {
        throw new Error('Failed to start Textract job');
      }

      // Wait for job completion
      await this.waitForJobCompletion(startResponse.JobId);

      // Get results
      const getCommand = new GetDocumentTextDetectionCommand({
        JobId: startResponse.JobId
      });

      const result = await this.textractClient.send(getCommand);
      
      // Process and save results
      const textContent = this.processTextractResponse(result);
      
      return textContent;

    } catch (error) {
      console.error('Error in Textract processing:', error);
      throw new Error('Failed to process document with Textract');
    }
  }

  private async waitForJobCompletion(jobId: string): Promise<void> {
    const maxAttempts = 30;
    const delaySeconds = 5;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const command = new GetDocumentTextDetectionCommand({ JobId: jobId });
      const response = await this.textractClient.send(command);

      if (response.JobStatus === 'SUCCEEDED') {
        return;
      }

      if (response.JobStatus === 'FAILED') {
        throw new Error('Textract job failed');
      }

      await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
      attempts++;
    }

    throw new Error('Textract job timed out');
  }

  private processTextractResponse(response: GetDocumentTextDetectionCommandOutput): string {
    let text = '';
    if (response.Blocks) {
      response.Blocks.forEach((block: TextractBlock) => {
        if (block.BlockType === 'LINE' && block.Text) {
          text += block.Text + '\n';
        }
      });
    }
    return text;
  }
}
