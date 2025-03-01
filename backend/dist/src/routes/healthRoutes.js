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
const mongoose_1 = __importDefault(require("mongoose"));
const aws_config_1 = require("../../config/aws-config");
const client_s3_1 = require("@aws-sdk/client-s3");
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Kontrollera MongoDB-anslutning
        const dbState = mongoose_1.default.connection.readyState;
        const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
        // Kontrollera AWS S3-anslutning
        let s3Status = 'unknown';
        try {
            yield aws_config_1.s3Client.send(new client_s3_1.HeadBucketCommand({
                Bucket: process.env.AWS_S3_BUCKET || ''
            }));
            s3Status = 'connected';
        }
        catch (error) {
            s3Status = 'error';
        }
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                database: dbStatus,
                s3: s3Status
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
}));
exports.default = router;
