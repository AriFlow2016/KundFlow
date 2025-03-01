import { createWorker } from 'tesseract.js';
import { TextractClient, AnalyzeDocumentCommand } from '@aws-sdk/client-textract';
import { readFileSync } from 'fs';

const textractClient = new TextractClient({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

interface ExtractedData {
  monthlyCost?: number;
  startDate?: string;
  endDate?: string;
  phoneNumbers: string[];
}

export class OCRService {
  private static async extractTextWithTesseract(filePath: string): Promise<string> {
    const worker = await createWorker('swe');
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();
    return text;
  }

  private static async extractTextWithTextract(filePath: string): Promise<string> {
    const fileBuffer = readFileSync(filePath);
    
    const command = new AnalyzeDocumentCommand({
      Document: {
        Bytes: fileBuffer
      },
      FeatureTypes: ['FORMS', 'TABLES']
    });

    try {
      const response = await textractClient.send(command);
      let extractedText = '';
      response.Blocks?.forEach(block => {
        if (block.BlockType === 'LINE' && block.Text) {
          extractedText += block.Text + '\n';
        }
      });
      return extractedText;
    } catch (error) {
      console.error('Error using Textract:', error);
      throw error;
    }
  }

  private static extractMonthlyCost(text: string): number | undefined {
    const costRegex = /(?:månads(?:kostnad|avgift)|kostnad per månad)[\s:]*(\d+(?:\s*\d+)*(?:[,.]\d{2})?)/i;
    const match = text.match(costRegex);
    if (match) {
      const cost = match[1].replace(/\s/g, '').replace(',', '.');
      return parseFloat(cost);
    }
    return undefined;
  }

  private static extractDates(text: string): { startDate?: string; endDate?: string } {
    const dateRegex = /(\d{4}[-/.]\d{2}[-/.]\d{2})/g;
    const dates = text.match(dateRegex) || [];
    
    return {
      startDate: dates[0],
      endDate: dates[dates.length - 1]
    };
  }

  private static extractPhoneNumbers(text: string): string[] {
    const phoneRegex = /(?:tel|telefon|mobil)?(?:[:.]|\s)*([+0][\d\s-]{8,})/gi;
    const matches = text.matchAll(phoneRegex);
    const phoneNumbers: string[] = [];
    
    for (const match of matches) {
      const number = match[1].replace(/[\s-]/g, '');
      if (number.length >= 8) {
        phoneNumbers.push(number);
      }
    }
    
    return phoneNumbers;
  }

  public static async processDocument(filePath: string, useTextract: boolean = true): Promise<ExtractedData> {
    try {
      const text = useTextract 
        ? await this.extractTextWithTextract(filePath)
        : await this.extractTextWithTesseract(filePath);

      const { startDate, endDate } = this.extractDates(text);
      const monthlyCost = this.extractMonthlyCost(text);
      const phoneNumbers = this.extractPhoneNumbers(text);

      return {
        monthlyCost,
        startDate,
        endDate,
        phoneNumbers
      };
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }
}
