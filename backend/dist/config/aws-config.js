"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textractClient = exports.s3Client = exports.S3_CONFIG = void 0;
const credential_providers_1 = require("@aws-sdk/credential-providers");
const client_s3_1 = require("@aws-sdk/client-s3");
const client_textract_1 = require("@aws-sdk/client-textract");
// Grundkonfiguration
const getAwsConfig = () => {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) {
        throw new Error('AWS credentials are not configured');
    }
    return {
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    };
};
exports.S3_CONFIG = {
    region: process.env.AWS_REGION || 'eu-north-1',
    bucket: process.env.AWS_S3_BUCKET || 'kundflow-contracts',
    textractBucket: process.env.AWS_TEXTRACT_BUCKET || 'kundflow-textract'
};
// S3 Client för Stockholm-regionen (eu-north-1)
exports.s3Client = new client_s3_1.S3Client({
    region: exports.S3_CONFIG.region,
    credentials: (0, credential_providers_1.fromEnv)()
});
// Textract Client för Ireland-regionen (eu-west-1)
exports.textractClient = new client_textract_1.TextractClient({
    region: 'eu-west-1', // Textract är inte tillgängligt i Stockholm
    credentials: (0, credential_providers_1.fromEnv)()
});
