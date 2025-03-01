import express from 'express';
import { upload, uploadToS3 } from '../../services/uploadService';
import { textractService } from '../../services/textractService';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Test route för filuppladdning och OCR
router.post('/test-upload', upload.single('file'), async (req, res) => {
    console.log('Mottog filuppladdningsförfrågan');
    
    try {
        if (!req.file) {
            console.log('Ingen fil hittades i förfrågan');
            return res.status(400).json({ error: 'Ingen fil uppladdad' });
        }

        console.log('Fil mottagen:', {
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            path: req.file.path
        });

        // Simulera ett customer ID för testet
        const testCustomerId = 'test-customer-123';

        try {
            // Ladda upp till S3
            const uploadResult = await uploadToS3(req.file, testCustomerId);
            console.log('S3 uppladdning lyckades:', uploadResult);

            // Extrahera text med Textract
            console.log('Startar OCR-processering...');
            const extractedText = await textractService.extractTextFromS3(uploadResult.key);
            console.log('OCR-processering klar');

            // Ta bort den temporära filen
            fs.unlinkSync(req.file.path);
            console.log('Temporär fil borttagen');

            res.json({
                message: 'Fil uppladdad och processerad framgångsrikt',
                fileDetails: uploadResult,
                extractedContent: extractedText
            });
        } catch (uploadError: any) {
            console.error('Fel vid filhantering:', {
                error: uploadError,
                message: uploadError.message,
                stack: uploadError.stack
            });
            res.status(500).json({ 
                error: 'Fel vid filhantering',
                details: uploadError.message
            });
        }
    } catch (error: any) {
        console.error('Oväntat fel i route:', {
            error,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            error: 'Oväntat fel vid filuppladdning',
            details: error.message
        });
    }
});

export default router;
