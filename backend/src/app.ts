import express from 'express';
import cors from 'cors';
import path from 'path';
import { upload, uploadToS3 } from '../services/uploadService';
import { textractService } from '../services/textractService';

export const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statiska filer
app.use(express.static(path.join(__dirname, '..'))); // Serve files from backend root

// Serve test-upload.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../test-upload.html'));
});

// Hantera filuppladdning
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('Ingen fil hittades');
        }

        console.log('Fil mottagen:', {
            originalname: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype
        });

        // Ladda upp till S3
        const uploadResult = await uploadToS3(req.file, 'test-customer');
        console.log('Fil uppladdad till S3:', uploadResult);

        // Extrahera text med Textract
        const extractedText = await textractService.extractTextFromS3(uploadResult.key, req.file.path);
        console.log('Text extraherad:', extractedText);

        res.json({
            success: true,
            data: {
                ...uploadResult,
                extractedText
            }
        });
    } catch (error) {
        console.error('Fel vid filhantering:', error);
        res.status(500).json({
            error: 'Fel vid filhantering',
            details: error.message
        });
    }
});

export default app;
