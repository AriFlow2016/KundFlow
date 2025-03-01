"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextractService = void 0;
const client_textract_1 = require("@aws-sdk/client-textract");
const s3Service_1 = require("./s3Service");
class TextractService {
    constructor() {
        const config = {
            region: process.env.AWS_REGION || 'eu-north-1'
        };
        this.textractClient = new client_textract_1.TextractClient(config);
        this.s3Service = new s3Service_1.S3Service();
    }
    async processDocument(file, key) {
        try {
            // Upload to S3 first (in textract bucket)
            await this.s3Service.uploadFile(file, key, true);
            // Start Textract job
            const documentLocation = {
                S3Object: {
                    Bucket: process.env.AWS_S3_TEXTRACT_BUCKET,
                    Name: key
                }
            };
            const startCommand = new client_textract_1.StartDocumentTextDetectionCommand({
                DocumentLocation: documentLocation
            });
            const startResponse = await this.textractClient.send(startCommand);
            if (!startResponse.JobId) {
                throw new Error('Failed to start Textract job');
            }
            // Wait for job completion
            await this.waitForJobCompletion(startResponse.JobId);
            // Get results
            const getCommand = new client_textract_1.GetDocumentTextDetectionCommand({
                JobId: startResponse.JobId
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
