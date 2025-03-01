"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCRService = void 0;
const tesseract_js_1 = require("tesseract.js");
const client_textract_1 = require("@aws-sdk/client-textract");
const fs_1 = require("fs");
const textractClient = new client_textract_1.TextractClient({
    region: process.env.AWS_REGION || 'eu-north-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
class OCRService {
    static async extractTextWithTesseract(filePath) {
        const worker = await (0, tesseract_js_1.createWorker)('swe');
        const { data: { text } } = await worker.recognize(filePath);
        await worker.terminate();
        return text;
    }
    static async extractTextWithTextract(filePath) {
        var _a;
        const fileBuffer = (0, fs_1.readFileSync)(filePath);
        const command = new client_textract_1.AnalyzeDocumentCommand({
            Document: {
                Bytes: fileBuffer
            },
            FeatureTypes: ['FORMS', 'TABLES']
        });
        try {
            const response = await textractClient.send(command);
            let extractedText = '';
            (_a = response.Blocks) === null || _a === void 0 ? void 0 : _a.forEach(block => {
                if (block.BlockType === 'LINE' && block.Text) {
                    extractedText += block.Text + '\n';
                }
            });
            return extractedText;
        }
        catch (error) {
            console.error('Error using Textract:', error);
            throw error;
        }
    }
    static extractMonthlyCost(text) {
        const costRegex = /(?:månads(?:kostnad|avgift)|kostnad per månad)[\s:]*(\d+(?:\s*\d+)*(?:[,.]\d{2})?)/i;
        const match = text.match(costRegex);
        if (match) {
            const cost = match[1].replace(/\s/g, '').replace(',', '.');
            return parseFloat(cost);
        }
        return undefined;
    }
    static extractDates(text) {
        const dateRegex = /(\d{4}[-/.]\d{2}[-/.]\d{2})/g;
        const dates = text.match(dateRegex) || [];
        return {
            startDate: dates[0],
            endDate: dates[dates.length - 1]
        };
    }
    static extractPhoneNumbers(text) {
        const phoneRegex = /(?:tel|telefon|mobil)?(?:[:.]|\s)*([+0][\d\s-]{8,})/gi;
        const matches = text.matchAll(phoneRegex);
        const phoneNumbers = [];
        for (const match of matches) {
            const number = match[1].replace(/[\s-]/g, '');
            if (number.length >= 8) {
                phoneNumbers.push(number);
            }
        }
        return phoneNumbers;
    }
    static async processDocument(filePath, useTextract = true) {
        try {
            const text = useTextract
                ? await this.extractTextWithTextract(filePath)
                : await this.extractTextWithTesseract(filePath);
            const { startDate, endDate } = this.extractDates(text);
            const monthlyCost = this.extractMonthlyCost(text);
            const phoneNumbers = this.extractPhoneNumbers(text);
            return {
                monthlyCost,
                startDate,
                endDate,
                phoneNumbers
            };
        }
        catch (error) {
            console.error('Error processing document:', error);
            throw error;
        }
    }
}
exports.OCRService = OCRService;
