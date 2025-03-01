"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const aws_config_1 = require("../config/aws-config");
const client_s3_1 = require("@aws-sdk/client-s3");
class S3Service {
    async uploadFile(file, key, isTextract = false) {
        try {
            const bucket = isTextract ? process.env.AWS_S3_TEXTRACT_BUCKET : process.env.AWS_S3_BUCKET;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await aws_config_1.s3Client.send(command);
            return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        }
        catch (error) {
            console.error('Error uploading to S3:', error);
            throw new Error('Failed to upload file to S3');
        }
    }
    async getDownloadUrl(key, isTextract = false) {
        try {
            const bucket = isTextract ? process.env.AWS_S3_TEXTRACT_BUCKET : process.env.AWS_S3_BUCKET;
            return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        }
        catch (error) {
            console.error('Error generating URL:', error);
            throw new Error('Failed to generate download URL');
        }
    }
    async deleteFile(key, isTextract = false) {
        try {
            const bucket = isTextract ? process.env.AWS_S3_TEXTRACT_BUCKET : process.env.AWS_S3_BUCKET;
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: bucket,
                Key: key,
            });
            await aws_config_1.s3Client.send(command);
        }
        catch (error) {
            console.error('Error deleting from S3:', error);
            throw new Error('Failed to delete file from S3');
        }
    }
}
exports.S3Service = S3Service;
