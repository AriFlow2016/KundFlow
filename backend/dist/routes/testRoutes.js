"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const uploadService_1 = require("../services/uploadService");
const textractService_1 = require("../services/textractService");
const router = express_1.default.Router();
const textractService = new textractService_1.TextractService();
// Test-endpoint för filuppladdning och Textract
router.post('/test-upload', auth_1.auth, (0, auth_1.checkRole)(['admin']), uploadService_1.uploadFile, async (req, res) => {
    try {
        const result = await (0, uploadService_1.processUpload)(req);
        const textractResult = await textractService.extractTextFromS3(result.filename);
        res.json(textractResult);
    }
    catch (error) {
        console.error('Test upload error:', error);
        res.status(500).json({ message: 'Error processing file' });
    }
});
// Test route för filuppladdning
router.post('/upload', uploadService_1.uploadFile, async (req, res) => {
    try {
        const result = await (0, uploadService_1.processUpload)(req);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
