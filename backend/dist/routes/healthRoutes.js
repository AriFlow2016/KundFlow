"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const aws_config_1 = require("../config/aws-config");
const client_s3_1 = require("@aws-sdk/client-s3");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        // Kontrollera MongoDB-anslutning
        const dbState = mongoose_1.default.connection.readyState;
        const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
        // Kontrollera AWS S3-anslutning för båda buckets
        let documentsStatus = 'unknown';
        let textractStatus = 'unknown';
        try {
            await aws_config_1.s3Client.send(new client_s3_1.HeadBucketCommand({
                Bucket: process.env.AWS_S3_BUCKET || ''
            }));
            documentsStatus = 'connected';
        }
        catch (error) {
            documentsStatus = 'error';
        }
        try {
            await aws_config_1.s3Client.send(new client_s3_1.HeadBucketCommand({
                Bucket: process.env.AWS_S3_TEXTRACT_BUCKET || ''
            }));
            textractStatus = 'connected';
        }
        catch (error) {
            textractStatus = 'error';
        }
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                database: dbStatus,
                s3_documents: documentsStatus,
                s3_textract: textractStatus
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
