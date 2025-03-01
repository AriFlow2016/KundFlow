"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUpload = exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const s3Service_1 = require("./s3Service");
const textractService_1 = require("./textractService");
const s3Service = new s3Service_1.S3Service();
const textractService = new textractService_1.TextractService();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
exports.uploadFile = upload.single('file');
const processUpload = async (req) => {
    if (!req.file) {
        throw new Error('No file uploaded');
    }
    const file = req.file;
    const key = `${Date.now()}-${file.originalname}`;
    // Upload to S3
    const s3Url = await s3Service.uploadFile(file, key);
    // Process with Textract if it's a PDF
    let textractResult = null;
    if (file.mimetype === 'application/pdf') {
        const textractKey = `textract/${key}`;
        textractResult = await textractService.processDocument(file, textractKey);
    }
    return {
        originalName: file.originalname,
        s3Url,
        textractResult
    };
};
exports.processUpload = processUpload;
