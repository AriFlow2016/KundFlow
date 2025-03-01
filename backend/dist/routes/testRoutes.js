"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadService_1 = require("../services/uploadService");
const router = express_1.default.Router();
// Test route för filuppladdning
router.post('/upload', uploadService_1.uploadFile, async (req, res) => {
    try {
        const result = await (0, uploadService_1.processUpload)(req);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
