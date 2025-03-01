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
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = require("fs");
const aws_config_1 = require("../../config/aws-config");
class S3Service {
    uploadFile(filePath, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileStream = (0, fs_1.createReadStream)(filePath);
                const uploadParams = {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: key,
                    Body: fileStream
                };
                yield aws_config_1.s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
                return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
            }
            catch (error) {
                console.error('Error uploading to S3:', error);
                throw new Error('Failed to upload file to S3');
            }
        });
    }
    deleteFile(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteParams = {
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: key
                };
                yield aws_config_1.s3Client.send(new client_s3_1.DeleteObjectCommand(deleteParams));
            }
            catch (error) {
                console.error('Error deleting from S3:', error);
                throw new Error('Failed to delete file from S3');
            }
        });
    }
}
exports.S3Service = S3Service;
