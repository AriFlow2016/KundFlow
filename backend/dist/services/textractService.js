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
exports.textractService = exports.TextractService = void 0;
const client_textract_1 = require("@aws-sdk/client-textract");
const aws_config_1 = require("../config/aws-config");
class TextractService {
    waitForJobCompletion(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let analysisComplete = false;
            while (!analysisComplete) {
                const getResultCommand = new client_textract_1.GetDocumentAnalysisCommand({
                    JobId: jobId
                });
                const result = yield aws_config_1.textractClient.send(getResultCommand);
                if (result.JobStatus === 'SUCCEEDED') {
                    analysisComplete = true;
                }
                else if (result.JobStatus === 'FAILED') {
                    throw new Error('Textract analysis failed: ' + result.StatusMessage);
                }
                else {
                    yield new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        });
    }
    extractTextFromS3(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startCommand = new client_textract_1.StartDocumentAnalysisCommand({
                    DocumentLocation: {
                        S3Object: {
                            Bucket: process.env.AWS_S3_BUCKET || '',
                            Name: key
                        }
                    },
                    FeatureTypes: ['FORMS', 'TABLES']
                });
                const response = yield aws_config_1.textractClient.send(startCommand);
                if (!response.JobId) {
                    throw new Error('No JobId received from Textract');
                }
                yield this.waitForJobCompletion(response.JobId);
                const getDocumentCommand = new client_textract_1.GetDocumentAnalysisCommand({
                    JobId: response.JobId
                });
                const result = yield aws_config_1.textractClient.send(getDocumentCommand);
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
        });
    }
}
exports.TextractService = TextractService;
exports.textractService = new TextractService();
