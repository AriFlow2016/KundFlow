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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const aws_config_1 = require("../../config/aws-config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
class S3Service {
    uploadFile(file_1, key_1) {
        return __awaiter(this, arguments, void 0, function* (file, key, isTextract = false) {
            try {
                const bucket = isTextract ? process.env.AWS_S3_TEXTRACT_BUCKET : process.env.AWS_S3_BUCKET;
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: bucket,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                });
                yield aws_config_1.s3Client.send(command);
                return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            }
            catch (error) {
                console.error('Error uploading to S3:', error);
                throw new Error('Failed to upload file to S3');
            }
        });
    }
    getSignedDownloadUrl(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, isTextract = false) {
            try {
                const bucket = isTextract ? process.env.AWS_S3_TEXTRACT_BUCKET : process.env.AWS_S3_BUCKET;
                const command = new client_s3_1.GetObjectCommand({
                    Bucket: bucket,
                    Key: key,
                });
                // Använd en kortare expireringstid för signerade URLs
                const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(aws_config_1.s3Client, command, { expiresIn: 900 }); // 15 minuter
                return signedUrl;
            }
            catch (error) {
                console.error('Error generating signed URL:', error);
                throw new Error('Failed to generate download URL');
            }
        });
    }
    deleteFile(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, isTextract = false) {
            try {
                const bucket = isTextract ? process.env.AWS_S3_TEXTRACT_BUCKET : process.env.AWS_S3_BUCKET;
                const command = new client_s3_1.DeleteObjectCommand({
                    Bucket: bucket,
                    Key: key,
                });
                yield aws_config_1.s3Client.send(command);
            }
            catch (error) {
                console.error('Error deleting from S3:', error);
                throw new Error('Failed to delete file from S3');
            }
        });
    }
}
exports.S3Service = S3Service;
