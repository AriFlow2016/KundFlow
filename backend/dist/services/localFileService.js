"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localFileService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const UPLOAD_DIR = path_1.default.join(__dirname, '../../uploads');
// Skapa uploads-mappen om den inte finns
const initializeUploadDir = async () => {
    try {
        await promises_1.default.access(UPLOAD_DIR);
    }
    catch (_a) {
        await promises_1.default.mkdir(UPLOAD_DIR, { recursive: true });
    }
};
// Initialisera vid start
initializeUploadDir();
exports.localFileService = {
    async uploadFile(file) {
        const fileExtension = path_1.default.extname(file.originalname);
        const randomString = crypto_1.default.randomBytes(16).toString('hex');
        const fileName = `${randomString}${fileExtension}`;
        const filePath = path_1.default.join(UPLOAD_DIR, fileName);
        // Spara filen
        await promises_1.default.writeFile(filePath, file.buffer);
        // Returnera filinfo
        return {
            key: fileName,
            url: `/api/uploads/${fileName}`,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size
        };
    },
    async deleteFile(key) {
        const filePath = path_1.default.join(UPLOAD_DIR, key);
        try {
            await promises_1.default.unlink(filePath);
        }
        catch (error) {
            console.error('Error deleting file:', error);
            throw new Error('Failed to delete file');
        }
    },
    async getFilePath(key) {
        const filePath = path_1.default.join(UPLOAD_DIR, key);
        try {
            await promises_1.default.access(filePath);
            return filePath;
        }
        catch (_a) {
            throw new Error('File not found');
        }
    },
};
