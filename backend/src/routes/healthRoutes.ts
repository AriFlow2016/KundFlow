import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { s3Client } from '../config/aws-config';
import { HeadBucketCommand } from '@aws-sdk/client-s3';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // Kontrollera MongoDB-anslutning
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';

    // Kontrollera AWS S3-anslutning för båda buckets
    let documentsStatus = 'unknown';
    let textractStatus = 'unknown';
    
    try {
      await s3Client.send(new HeadBucketCommand({ 
        Bucket: process.env.AWS_S3_BUCKET || ''
      }));
      documentsStatus = 'connected';
    } catch (error) {
      documentsStatus = 'error';
    }

    try {
      await s3Client.send(new HeadBucketCommand({ 
        Bucket: process.env.AWS_S3_TEXTRACT_BUCKET || ''
      }));
      textractStatus = 'connected';
    } catch (error) {
      textractStatus = 'error';
    }

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        s3_documents: documentsStatus,
        s3_textract: textractStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
