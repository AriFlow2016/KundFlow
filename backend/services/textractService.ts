import { 
    StartDocumentAnalysisCommand,
    GetDocumentAnalysisCommand,
    TextractClient
} from '@aws-sdk/client-textract';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { textractClient, s3ClientIreland, S3_CONFIG } from '../config/aws-config';
import fs from 'fs';
import path from 'path';

interface Block {
  BlockType?: string;
  Text?: string;
  Relationships?: Array<{ Type: string; Ids: string[] }>;
  Id?: string;
  [key: string]: any;
}

interface ExtractedText {
  text: string;
  confidence: number;
  keyValuePairs: { [key: string]: string };
}

function sortBlocks(a: Block, b: Block): number {
  return a.Id?.localeCompare(b.Id || '') || 0;
}

function findRelationshipIds(rel: { Type: string; Ids: string[] }, id: string, b: Block): boolean {
  return rel.Ids.includes(id);
}

const findBlockById = (blocks: Block[], id: string): Block | undefined => {
  return blocks.find((b: Block) => b.Id === id);
};

const findBlocksByType = (blocks: Block[], type: string): Block[] => {
  return blocks.filter((b: Block) => b.BlockType === type);
};

const findRelatedBlocks = (blocks: Block[], relationships: Array<{ Type: string; Ids: string[] }>, type: string): Block[] => {
  const relatedIds = relationships
    .filter((rel) => rel.Type === type)
    .flatMap((id) => id.Ids);
  
  return blocks.filter((b: Block) => relatedIds.includes(b.Id || ''));
};

export class TextractService {
  async extractTextFromS3(key: string, filePath: string): Promise<ExtractedText> {
    try {
      console.log('Startar textextraktion från dokument:', key);
      console.log('S3 Config:', S3_CONFIG);

      console.log('Söker temporär fil:', filePath);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Temporär fil hittades inte: ${filePath}`);
      }

      // Ladda upp filen direkt till Textract-bucketen i Irland
      const fileStream = fs.createReadStream(filePath);
      
      const uploadParams = {
        Bucket: S3_CONFIG.textractBucket,
        Key: key,
        Body: fileStream,
        ContentType: 'application/pdf'
      };

      console.log('Laddar upp fil till Textract-bucket med parametrar:', uploadParams);
      await s3ClientIreland.send(new PutObjectCommand(uploadParams));
      console.log('Fil uppladdad till Textract-bucket');

      // Starta asynkron dokumentanalys för PDF
      const startCommand = new StartDocumentAnalysisCommand({
        DocumentLocation: {
          S3Object: {
            Bucket: S3_CONFIG.textractBucket,
            Name: key
          }
        },
        FeatureTypes: ['FORMS', 'TABLES']
      });

      console.log('Startar Textract-analys med parametrar:', startCommand.input);
      const startResponse = await textractClient.send(startCommand);
      const jobId = startResponse.JobId;

      if (!jobId) {
        throw new Error('Inget jobb-ID returnerades från Textract');
      }

      console.log('Textract jobb startat med ID:', jobId);

      // Vänta på att analysen ska bli klar
      let analysisComplete = false;
      let result;

      while (!analysisComplete) {
        const getResultCommand = new GetDocumentAnalysisCommand({
          JobId: jobId
        });

        result = await textractClient.send(getResultCommand);

        if (result.JobStatus === 'SUCCEEDED') {
          analysisComplete = true;
        } else if (result.JobStatus === 'FAILED') {
          throw new Error('Textract-analys misslyckades: ' + result.StatusMessage);
        } else {
          // Vänta 2 sekunder innan nästa kontroll
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Extrahera text och key-value pairs från resultatet
      const text = result?.Blocks
        ?.filter(block => block.BlockType === 'LINE')
        .map(block => block.Text)
        .join('\n') || '';

      const confidence = result?.Blocks?.[0]?.Confidence || 0;

      const keyValuePairs: { [key: string]: string } = {};
      result?.Blocks?.forEach(block => {
        if (block.BlockType === 'KEY_VALUE_SET' && block.EntityTypes?.includes('KEY')) {
          const key = block.Relationships
            ?.find(rel => rel.Type === 'CHILD')
            ?.Ids?.map(id => 
              result?.Blocks?.find(b => b.Id === id)?.Text
            ).join(' ');

          const valueBlock = block.Relationships
            ?.find(rel => rel.Type === 'VALUE')
            ?.Ids?.map(id => 
              result?.Blocks?.find(b => b.Id === id)
            )[0];

          const value = valueBlock?.Relationships
            ?.find(rel => rel.Type === 'CHILD')
            ?.Ids?.map(id =>
              result?.Blocks?.find(b => b.Id === id)?.Text
            ).join(' ');

          if (key && value) {
            keyValuePairs[key] = value;
          }
        }
      });

      console.log('Textextraktion slutförd');
      return { text, confidence, keyValuePairs };
    } catch (error) {
      console.error('Detaljerat fel vid textextraktion:', error);
      throw error;
    }
  }
}

export const textractService = new TextractService();
