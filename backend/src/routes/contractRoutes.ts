import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { Contract } from '../models/Contract';
import { auth, checkRole } from '../middleware/auth';
import { validateObjectId } from '../middleware/validation';
import { upload } from '../services/uploadService';
import { localFileService } from '../services/localFileService';

const router = express.Router();

// Hämta alla avtal för en kund
router.get(
  '/customer/:customerId',
  auth,
  validateObjectId('customerId'),
  async (req: Request, res: Response) => {
    try {
      const contracts = await Contract.find({ customerId: req.params.customerId })
        .sort({ endDate: 1 });
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contracts' });
    }
  }
);

// Ladda upp ett nytt avtal
router.post(
  '/upload',
  auth,
  checkRole(['admin', 'manager']),
  upload.single('document'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const result = await localFileService.uploadFile(req.file);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error uploading file' });
    }
  }
);

// Ta bort ett avtal
router.delete(
  '/:id',
  auth,
  checkRole(['admin', 'manager']),
  validateObjectId('id'),
  async (req: Request, res: Response) => {
    try {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
      await contract.deleteOne();
      res.json({ message: 'Contract deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting contract' });
    }
  }
);

export default router;
