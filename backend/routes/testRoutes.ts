import express from 'express';
import { upload, uploadToS3 } from '../services/uploadService';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Test route för filuppladdning
router.post('/test-upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Ingen fil uppladdad' });
        }

        // Simulera ett customer ID för testet
        const testCustomerId = 'test-customer-123';

        // Ladda upp till S3
        const result = await uploadToS3(req.file, testCustomerId);

        // Ta bort den temporära filen
        fs.unlinkSync(req.file.path);

        res.json({
            message: 'Fil uppladdad framgångsrikt',
            fileDetails: result
        });
    } catch (error) {
        console.error('Test upload error:', error);
        res.status(500).json({ error: 'Fel vid filuppladdning' });
    }
});

export default router;
