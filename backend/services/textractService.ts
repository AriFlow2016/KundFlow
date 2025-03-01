import { 
  TextractClient, 
  GetDocumentAnalysisCommand, 
  StartDocumentAnalysisCommand 
} from '@aws-sdk/client-textract';
import { textractClient } from '../config/aws-config';

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
  private async waitForJobCompletion(jobId: string): Promise<void> {
    let analysisComplete = false;
    while (!analysisComplete) {
      const getResultCommand = new GetDocumentAnalysisCommand({
        JobId: jobId
      });

      const result = await textractClient.send(getResultCommand);

      if (result.JobStatus === 'SUCCEEDED') {
        analysisComplete = true;
      } else if (result.JobStatus === 'FAILED') {
        throw new Error('Textract analysis failed: ' + result.StatusMessage);
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
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

      const response = await textractClient.send(startCommand);

      if (!response.JobId) {
        throw new Error('No JobId received from Textract');
      }

      await this.waitForJobCompletion(response.JobId);

      const getDocumentCommand = new GetDocumentAnalysisCommand({
        JobId: response.JobId
      });

      const result = await textractClient.send(getDocumentCommand);
      
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
}

export const textractService = new TextractService();
