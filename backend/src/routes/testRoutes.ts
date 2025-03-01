import express, { Request, Response } from 'express';
import { auth, checkRole } from '../middleware/auth';
import { upload } from '../../services/uploadService';
import { TextractService } from '../../services/textractService';

const router = express.Router();
const textractService = new TextractService();

// Test-endpoint för filuppladdning och Textract
router.post(
  '/test-upload',
  auth,
  checkRole(['admin']),
  upload.single('document'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const result = await textractService.extractTextFromS3(req.file.filename);
      res.json(result);
    } catch (error) {
      console.error('Test upload error:', error);
      res.status(500).json({ message: 'Error processing file' });
    }
  }
);

export default router;
