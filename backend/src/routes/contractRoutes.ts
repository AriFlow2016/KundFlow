import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { Contract } from '../models/Contract';
import { auth, checkRole } from '../middleware/auth';
import { validateObjectId } from '../middleware/validation';
import { uploadFile, processUpload } from '../services/uploadService';
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
  uploadFile,
  async (req: Request, res: Response) => {
    try {
      const uploadResult = await processUpload(req);
      
      const contract = new Contract({
        originalName: uploadResult.originalName,
        s3Url: uploadResult.s3Url,
        textractResult: uploadResult.textractResult,
        uploadDate: new Date()
      });

      await contract.save();
      res.json(contract);
    } catch (error) {
      console.error('Contract upload error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Hämta alla kontrakt
router.get(
  '/',
  auth,
  async (req: Request, res: Response) => {
    try {
      const contracts = await Contract.find().sort({ uploadDate: -1 });
      res.json(contracts);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Hämta ett specifikt kontrakt
router.get(
  '/:id',
  auth,
  validateObjectId('id'),
  async (req: Request, res: Response) => {
    try {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }
      res.json(contract);
    } catch (error) {
      console.error('Error fetching contract:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
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
