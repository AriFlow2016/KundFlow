import { 
  TextractClient, 
  StartDocumentTextDetectionCommand, 
  GetDocumentTextDetectionCommand,
  Block
} from "@aws-sdk/client-textract";
import { textractClient } from '../config/aws-config';
import { S3Service } from './s3Service';
import { Express } from 'express';

export interface Block {
  BlockType?: string;
  Text?: string;
  Confidence?: number;
  EntityTypes?: string[];
  RowIndex?: number;
  ColumnIndex?: number;
  RowSpan?: number;
  ColumnSpan?: number;
  Page?: number;
  Id?: string;
  Relationships?: Array<{ Type: string; Ids: string[] }>;
}

export interface ExtractedText {
  text: string;
  confidence: number;
  keyValuePairs: Record<string, string>;
}

export class TextractService {
  private textractClient: TextractClient;
  private s3Service: S3Service;

  constructor() {
    this.textractClient = textractClient;
    this.s3Service = new S3Service();
  }

  async processDocument(file: Express.Multer.File, key: string): Promise<string> {
    try {
      // Upload to S3 first (in textract bucket)
      await this.s3Service.uploadFile(file, key, true);

      // Start Textract job
      const startCommand = new StartDocumentTextDetectionCommand({
        DocumentLocation: {
          S3Object: {
            Bucket: process.env.AWS_S3_TEXTRACT_BUCKET,
            Name: key
          }
        }
      });

      const { JobId } = await this.textractClient.send(startCommand);
      
      if (!JobId) {
        throw new Error('Failed to start Textract job');
      }

      // Wait for job completion
      await this.waitForJobCompletion(JobId);

      // Get results
      const getCommand = new GetDocumentTextDetectionCommand({
        JobId
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

  async extractTextFromS3(key: string): Promise<ExtractedText> {
    try {
      const startCommand = new StartDocumentAnalysisCommand({
        DocumentLocation: {
          S3Object: {
            Bucket: process.env.AWS_S3_BUCKET || '',
            Name: key
          }
        },
        FeatureTypes: ['FORMS', 'TABLES']
      });

      const response = await this.textractClient.send(startCommand);

      if (!response.JobId) {
        throw new Error('No JobId received from Textract');
      }

      await this.waitForJobCompletion(response.JobId);

      const getDocumentCommand = new GetDocumentAnalysisCommand({
        JobId: response.JobId
      });

      const result = await this.textractClient.send(getDocumentCommand);
      
      const blocks = result.Blocks || [];
      const text = blocks
        .filter(block => block.BlockType === 'LINE')
        .map(block => block.Text)
        .join('\n');

      const confidence = blocks.reduce((acc, block) => acc + (block.Confidence || 0), 0) / blocks.length;

      const keyValuePairs: Record<string, string> = {};
      blocks
        .filter(block => block.BlockType === 'KEY_VALUE_SET')
        .forEach(block => {
          if (block.EntityTypes?.includes('KEY')) {
            const value = blocks.find(b => 
              b.BlockType === 'KEY_VALUE_SET' && 
              b.EntityTypes?.includes('VALUE') &&
              b.Id === block.Relationships?.[0]?.Ids?.[0]
            );
            if (block.Text && value?.Text) {
              keyValuePairs[block.Text] = value.Text;
            }
          }
        });

      return {
        text,
        confidence,
        keyValuePairs
      };
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

  private processTextractResponse(response: { Blocks?: Block[] }): string {
    let text = '';
    if (response.Blocks) {
      response.Blocks.forEach((block: Block) => {
        if (block.BlockType === 'LINE' && block.Text) {
          text += block.Text + '\n';
        }
      });
    }
    return text;
  }
}

export const textractService = new TextractService();
