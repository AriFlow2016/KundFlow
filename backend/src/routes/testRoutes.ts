import express, { Request, Response } from 'express';
import { uploadFile, processUpload } from '../services/uploadService';

const router = express.Router();

// Test route för filuppladdning
router.post('/upload', uploadFile, async (req: Request, res: Response) => {
  try {
    const result = await processUpload(req);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
