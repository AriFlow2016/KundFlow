import multer from 'multer';
import { S3Service } from './s3Service';
import { TextractService } from './textractService';
import { Request } from 'express';

const s3Service = new S3Service();
const textractService = new TextractService();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const uploadFile = upload.single('file');

export const processUpload = async (req: Request) => {
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  const file = req.file;
  const key = `${Date.now()}-${file.originalname}`;
  
  // Upload to S3
  const s3Url = await s3Service.uploadFile(file, key);
  
  // Process with Textract if it's a PDF
  let textractResult = null;
  if (file.mimetype === 'application/pdf') {
    const textractKey = `textract/${key}`;
    textractResult = await textractService.processDocument(file, textractKey);
  }

  return {
    originalName: file.originalname,
    s3Url,
    textractResult
  };
};
