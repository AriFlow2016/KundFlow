"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAwsConfig = exports.S3_CONFIG = exports.textractClient = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const client_textract_1 = require("@aws-sdk/client-textract");
// Grundläggande AWS-konfiguration
const awsConfig = {
    region: process.env.AWS_REGION || 'eu-north-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
};
// S3-klient för fillagring
exports.s3Client = new client_s3_1.S3Client(awsConfig);
// Textract-klient för OCR
exports.textractClient = new client_textract_1.TextractClient(awsConfig);
// S3-bucket konfiguration
exports.S3_CONFIG = {
    bucket: process.env.AWS_S3_BUCKET || 'kundflow-documents',
    baseUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`
};
// Validera AWS-konfiguration
const validateAwsConfig = () => {
    const requiredEnvVars = [
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'AWS_REGION',
        'AWS_S3_BUCKET'
    ];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Saknade AWS-miljövariabler: ${missingVars.join(', ')}`);
    }
};
exports.validateAwsConfig = validateAwsConfig;
