"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const uploadService_1 = require("../../services/uploadService");
const textractService_1 = require("../../services/textractService");
const router = express_1.default.Router();
const textractService = new textractService_1.TextractService();
// Test-endpoint för filuppladdning och Textract
router.post('/test-upload', auth_1.auth, (0, auth_1.checkRole)(['admin']), uploadService_1.upload.single('document'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const result = yield textractService.extractTextFromS3(req.file.filename);
        res.json(result);
    }
    catch (error) {
        console.error('Test upload error:', error);
        res.status(500).json({ message: 'Error processing file' });
    }
}));
exports.default = router;
