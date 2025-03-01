import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { Contract } from '../models/Contract';
import { localFileService } from '../services/localFileService';
import { auth, checkRole } from '../middleware/auth';
import { validateObjectId } from '../middleware/validation';
import { textractService } from '../../services/textractService';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/temp',
  filename: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Statisk filserving för uppladdade filer
router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

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

// Skapa nytt avtal
router.post(
  '/',
  auth,
  checkRole(['admin', 'manager']),
  upload.single('document'),
  async (req: Request, res: Response) => {
    try {
      const contractData = JSON.parse(req.body.contract);
      
      let documentInfo = {};
      if (req.file) {
        const { key, url } = await localFileService.uploadFile(req.file, contractData.customerId);
        documentInfo = {
          documentKey: key,
          documentUrl: url,
          documentName: req.file.originalname,
        };
      }

      const contract = new Contract({
        ...contractData,
        ...documentInfo,
      });

      await contract.save();
      res.status(201).json(contract);
    } catch (error) {
      console.error('Error creating contract:', error);
      res.status(500).json({ message: 'Kunde inte skapa avtal' });
    }
  }
);

// Uppdatera avtal
router.put(
  '/:id',
  auth,
  checkRole(['admin', 'manager']),
  validateObjectId('id'),
  upload.single('document'),
  async (req: Request, res: Response) => {
    try {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ message: 'Avtalet hittades inte' });
      }

      const contractData = JSON.parse(req.body.contract);
      
      let documentInfo = {};
      if (req.file) {
        // Ta bort gammalt dokument om det finns
        if (contract.documentKey) {
          await localFileService.deleteFile(contract.documentKey);
        }

        const { key, url } = await localFileService.uploadFile(req.file, contract.customerId.toString());
        documentInfo = {
          documentKey: key,
          documentUrl: url,
          documentName: req.file.originalname,
        };
      }

      const updatedContract = await Contract.findByIdAndUpdate(
        req.params.id,
        {
          ...contractData,
          ...documentInfo,
        },
        { new: true }
      );

      res.json(updatedContract);
    } catch (error) {
      console.error('Error updating contract:', error);
      res.status(500).json({ message: 'Kunde inte uppdatera avtal' });
    }
  }
);

// Ladda upp fil
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

      const result = await localFileService.processUploadedFile(req.file);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error processing file' });
    }
  }
);

// Ta bort avtal
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

      if (contract.documentKey) {
        await localFileService.deleteFile(contract.documentKey);
      }

      await contract.remove();
      res.json({ message: 'Contract deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting contract' });
    }
  }
);

export default router;
