"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.uploadToS3 = uploadToS3;
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const aws_config_1 = require("../config/aws-config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Konfigurera multer för temporär fillagring
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads/temp');
        // Skapa uploads/temp mappen om den inte finns
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, callback) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    }
    else {
        callback(new Error('Invalid file type'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});
async function uploadToS3(file, customerId) {
    try {
        console.log('Startar S3-uppladdning:', {
            file: file.originalname,
            customerId,
            config: aws_config_1.S3_CONFIG
        });
        const fileStream = fs_1.default.createReadStream(file.path);
        const uniqueId = path_1.default.basename(file.path).split('-')[0];
        const key = `contracts/${customerId}/${uniqueId}-${file.originalname}`;
        console.log('Förbereder uppladdning:', {
            bucket: aws_config_1.S3_CONFIG.bucket,
            key,
            path: file.path
        });
        const uploadParams = {
            Bucket: aws_config_1.S3_CONFIG.bucket,
            Key: key,
            Body: fileStream,
            ContentType: file.mimetype
        };
        console.log('Laddar upp fil med parametrar:', uploadParams);
        await aws_config_1.s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
        console.log('Fil uppladdad till S3');
        return {
            key,
            url: `https://${aws_config_1.S3_CONFIG.bucket}.s3.amazonaws.com/${key}`,
            filename: file.originalname
        };
    }
    catch (error) {
        console.error('Detaljerat fel vid S3-uppladdning:', error);
        throw error;
    }
}
