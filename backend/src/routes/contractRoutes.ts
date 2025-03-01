import express from 'express';
import multer from 'multer';
import { Contract } from '../models/Contract';
import { localFileService } from '../services/localFileService';
import { checkAuth, checkRole } from '../middleware/auth';
import { validateObjectId } from '../middleware/validation';
import path from 'path';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB gräns
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Statisk filserving för uppladdade filer
router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Hämta alla avtal för en kund
router.get(
  '/customer/:customerId',
  checkAuth,
  validateObjectId('customerId'),
  async (req, res) => {
    try {
      const contracts = await Contract.find({ customerId: req.params.customerId })
        .sort({ endDate: 1 });
      res.json(contracts);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      res.status(500).json({ message: 'Kunde inte hämta avtal' });
    }
  }
);

// Skapa nytt avtal
router.post(
  '/',
  checkAuth,
  checkRole(['admin', 'manager']),
  upload.single('document'),
  async (req, res) => {
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
  checkAuth,
  checkRole(['admin', 'manager']),
  validateObjectId('id'),
  upload.single('document'),
  async (req, res) => {
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

// Ta bort avtal
router.delete(
  '/:id',
  checkAuth,
  checkRole(['admin', 'manager']),
  validateObjectId('id'),
  async (req, res) => {
    try {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ message: 'Avtalet hittades inte' });
      }

      if (contract.documentKey) {
        await localFileService.deleteFile(contract.documentKey);
      }

      await contract.remove();
      res.json({ message: 'Avtalet har tagits bort' });
    } catch (error) {
      console.error('Error deleting contract:', error);
      res.status(500).json({ message: 'Kunde inte ta bort avtal' });
    }
  }
);

export default router;
