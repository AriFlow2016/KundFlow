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
exports.localFileService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const UPLOAD_DIR = path_1.default.join(__dirname, '../../uploads');
// Skapa uploads-mappen om den inte finns
const initializeUploadDir = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield promises_1.default.access(UPLOAD_DIR);
    }
    catch (_a) {
        yield promises_1.default.mkdir(UPLOAD_DIR, { recursive: true });
    }
});
// Initialisera vid start
initializeUploadDir();
exports.localFileService = {
    uploadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileExtension = path_1.default.extname(file.originalname);
            const randomString = crypto_1.default.randomBytes(16).toString('hex');
            const fileName = `${randomString}${fileExtension}`;
            const filePath = path_1.default.join(UPLOAD_DIR, fileName);
            // Spara filen
            yield promises_1.default.writeFile(filePath, file.buffer);
            // Returnera filinfo
            return {
                key: fileName,
                url: `/api/uploads/${fileName}`,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size
            };
        });
    },
    deleteFile(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(UPLOAD_DIR, key);
            try {
                yield promises_1.default.unlink(filePath);
            }
            catch (error) {
                console.error('Error deleting file:', error);
                throw new Error('Failed to delete file');
            }
        });
    },
    getFilePath(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(UPLOAD_DIR, key);
            try {
                yield promises_1.default.access(filePath);
                return filePath;
            }
            catch (_a) {
                throw new Error('File not found');
            }
        });
    },
};
