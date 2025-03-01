import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_CONFIG } from '../config/aws-config';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Konfigurera multer för temporär fillagring
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(__dirname, '../../uploads/temp');
    // Skapa uploads/temp mappen om den inte finns
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    callback(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Invalid file type'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export async function uploadToS3(file: Express.Multer.File, customerId: string) {
  try {
    console.log('Startar S3-uppladdning:', {
      file: file.originalname,
      customerId,
      config: S3_CONFIG
    });

    const fileStream = fs.createReadStream(file.path);
    const uniqueId = path.basename(file.path).split('-')[0];
    const key = `contracts/${customerId}/${uniqueId}-${file.originalname}`;

    console.log('Förbereder uppladdning:', {
      bucket: S3_CONFIG.bucket,
      key,
      path: file.path
    });

    const uploadParams = {
      Bucket: S3_CONFIG.bucket,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype
    };

    console.log('Laddar upp fil med parametrar:', uploadParams);
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('Fil uppladdad till S3');

    return {
      key,
      url: `https://${S3_CONFIG.bucket}.s3.amazonaws.com/${key}`,
      filename: file.originalname
    };
  } catch (error) {
    console.error('Detaljerat fel vid S3-uppladdning:', error);
    throw error;
  }
}
