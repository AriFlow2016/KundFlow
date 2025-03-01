"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textractService = exports.TextractService = void 0;
const client_textract_1 = require("@aws-sdk/client-textract");
const aws_config_1 = require("../config/aws-config");
const s3Service_1 = require("./s3Service");
class TextractService {
    constructor() {
        this.textractClient = aws_config_1.textractClient;
        this.s3Service = new s3Service_1.S3Service();
    }
    async processDocument(file, key) {
        try {
            // Upload to S3 first (in textract bucket)
            await this.s3Service.uploadFile(file, key, true);
            // Start Textract job
            const startCommand = new client_textract_1.StartDocumentTextDetectionCommand({
                DocumentLocation: {
                    S3Object: {
                        Bucket: process.env.AWS_S3_TEXTRACT_BUCKET,
                        Name: key
                    }
                }
            });
            const { JobId } = await this.textractClient.send(startCommand);
            if (!JobId) {
                throw new Error('Failed to start Textract job');
            }
            // Wait for job completion
            await this.waitForJobCompletion(JobId);
            // Get results
            const getCommand = new client_textract_1.GetDocumentTextDetectionCommand({
                JobId
            });
            const result = await this.textractClient.send(getCommand);
            // Process and save results
            const textContent = this.processTextractResponse(result);
            return textContent;
        }
        catch (error) {
            console.error('Error in Textract processing:', error);
            throw new Error('Failed to process document with Textract');
        }
    }
    async extractTextFromS3(key) {
        try {
            const startCommand = new StartDocumentAnalysisCommand({
                DocumentLocation: {
                    S3Object: {
                        Bucket: process.env.AWS_S3_BUCKET || '',
                        Name: key
                    }
                },
                FeatureTypes: ['FORMS', 'TABLES']
            });
            const response = await this.textractClient.send(startCommand);
            if (!response.JobId) {
                throw new Error('No JobId received from Textract');
            }
            await this.waitForJobCompletion(response.JobId);
            const getDocumentCommand = new GetDocumentAnalysisCommand({
                JobId: response.JobId
            });
            const result = await this.textractClient.send(getDocumentCommand);
            const blocks = result.Blocks || [];
            const text = blocks
                .filter(block => block.BlockType === 'LINE')
                .map(block => block.Text)
                .join('\n');
            const confidence = blocks.reduce((acc, block) => acc + (block.Confidence || 0), 0) / blocks.length;
            const keyValuePairs = {};
            blocks
                .filter(block => block.BlockType === 'KEY_VALUE_SET')
                .forEach(block => {
                var _a;
                if ((_a = block.EntityTypes) === null || _a === void 0 ? void 0 : _a.includes('KEY')) {
                    const value = blocks.find(b => {
                        var _a, _b, _c, _d;
                        return b.BlockType === 'KEY_VALUE_SET' &&
                            ((_a = b.EntityTypes) === null || _a === void 0 ? void 0 : _a.includes('VALUE')) &&
                            b.Id === ((_d = (_c = (_b = block.Relationships) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.Ids) === null || _d === void 0 ? void 0 : _d[0]);
                    });
                    if (block.Text && (value === null || value === void 0 ? void 0 : value.Text)) {
                        keyValuePairs[block.Text] = value.Text;
                    }
                }
            });
            return {
                text,
                confidence,
                keyValuePairs
            };
        }
        catch (error) {
            console.error('Error in Textract processing:', error);
            throw new Error('Failed to process document with Textract');
        }
    }
    async waitForJobCompletion(jobId) {
        const maxAttempts = 30;
        const delaySeconds = 5;
        let attempts = 0;
        while (attempts < maxAttempts) {
            const command = new client_textract_1.GetDocumentTextDetectionCommand({ JobId: jobId });
            const response = await this.textractClient.send(command);
            if (response.JobStatus === 'SUCCEEDED') {
                return;
            }
            if (response.JobStatus === 'FAILED') {
                throw new Error('Textract job failed');
            }
            await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
            attempts++;
        }
        throw new Error('Textract job timed out');
    }
    processTextractResponse(response) {
        let text = '';
        if (response.Blocks) {
            response.Blocks.forEach((block) => {
                if (block.BlockType === 'LINE' && block.Text) {
                    text += block.Text + '\n';
                }
            });
        }
        return text;
    }
}
exports.TextractService = TextractService;
exports.textractService = new TextractService();
