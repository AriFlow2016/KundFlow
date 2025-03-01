import express from 'express';
import asyncHandler from 'express-async-handler';
import { upload } from '../services/uploadService';
import { Agreement } from '../models/Agreement';
import { addToProcessingQueue } from '../queue/processingQueue';
import { checkAuth } from '../middleware/authMiddleware';

const router = express.Router();

// Hämta alla avtal för en kund
router.get(
  '/customer/:customerId',
  checkAuth,
  asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const agreements = await Agreement.find({ customerId })
      .sort({ createdAt: -1 });
    res.json(agreements);
  })
);

// Ladda upp ett eller flera avtal
router.post(
  '/upload',
  checkAuth,
  upload.array('files', 10), // Max 10 filer samtidigt
  asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[];
    const { customerId } = req.body;

    if (!files || files.length === 0) {
      res.status(400);
      throw new Error('Inga filer uppladdade');
    }

    const agreements = [];

    for (const file of files) {
      // Skapa en ny post i databasen för varje fil
      const agreement = await Agreement.create({
        customerId,
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileUrl: '', // Kommer uppdateras efter S3-uppladdning
        status: 'pending'
      });

      // Lägg till i processkön
      await addToProcessingQueue({
        agreementId: agreement._id,
        filePath: file.path,
        customerId
      });

      agreements.push(agreement);
    }

    res.status(201).json({
      message: `${files.length} avtal har laddats upp och köats för processering`,
      agreements
    });
  })
);

// Hämta ett specifikt avtal
router.get(
  '/:id',
  checkAuth,
  asyncHandler(async (req, res) => {
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) {
      res.status(404);
      throw new Error('Avtalet hittades inte');
    }
    res.json(agreement);
  })
);

// Ta bort ett avtal
router.delete(
  '/:id',
  checkAuth,
  asyncHandler(async (req, res) => {
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) {
      res.status(404);
      throw new Error('Avtalet hittades inte');
    }
    
    // TODO: Ta bort fil från S3
    
    await agreement.remove();
    res.json({ message: 'Avtalet har tagits bort' });
  })
);

export default router;
