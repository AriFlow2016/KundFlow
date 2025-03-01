import Queue from 'bull';
import { OCRService } from '../services/ocrService';
import { Agreement } from '../models/Agreement';
import { uploadToS3 } from '../services/uploadService';
import { unlink } from 'fs/promises';

// Skapa en Redis-baserad kö för dokumentprocessering
const documentQueue = new Queue('document-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

interface ProcessingJob {
  agreementId: string;
  filePath: string;
  customerId: string;
}

// Hantera dokumentprocessering
documentQueue.process(async (job) => {
  const { agreementId, filePath, customerId } = job.data as ProcessingJob;
  
  try {
    // Uppdatera status till processing
    await Agreement.findByIdAndUpdate(agreementId, { status: 'processing' });

    // Kör OCR på dokumentet
    const extractedData = await OCRService.processDocument(filePath);

    // Ladda upp till S3
    const s3Upload = await uploadToS3({
      path: filePath,
      mimetype: 'application/pdf',
      filename: filePath.split('/').pop() || ''
    } as Express.Multer.File, customerId);

    // Uppdatera agreement med extraherad data och S3-information
    await Agreement.findByIdAndUpdate(agreementId, {
      status: 'completed',
      filePath: s3Upload.key,
      fileUrl: s3Upload.url,
      startDate: extractedData.startDate,
      endDate: extractedData.endDate,
      monthlyCost: extractedData.monthlyCost,
      phoneNumbers: extractedData.phoneNumbers
    });

    // Ta bort temporär fil
    await unlink(filePath);

    return { success: true, data: extractedData };
  } catch (error) {
    console.error('Error processing document:', error);
    
    // Uppdatera status till failed vid fel
    await Agreement.findByIdAndUpdate(agreementId, { 
      status: 'failed',
      error: error.message 
    });

    throw error;
  }
});

// Lägg till ett jobb i kön
export const addToProcessingQueue = async (data: ProcessingJob) => {
  return await documentQueue.add(data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
};
