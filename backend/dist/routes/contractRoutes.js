"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Contract_1 = require("../models/Contract");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const uploadService_1 = require("../services/uploadService");
const router = express_1.default.Router();
// Hämta alla avtal för en kund
router.get('/customer/:customerId', auth_1.auth, (0, validation_1.validateObjectId)('customerId'), async (req, res) => {
    try {
        const contracts = await Contract_1.Contract.find({ customerId: req.params.customerId })
            .sort({ endDate: 1 });
        res.json(contracts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching contracts' });
    }
});
// Ladda upp ett nytt avtal
router.post('/upload', auth_1.auth, (0, auth_1.checkRole)(['admin', 'manager']), uploadService_1.uploadFile, async (req, res) => {
    try {
        const uploadResult = await (0, uploadService_1.processUpload)(req);
        const contract = new Contract_1.Contract({
            originalName: uploadResult.originalName,
            s3Url: uploadResult.s3Url,
            textractResult: uploadResult.textractResult,
            uploadDate: new Date()
        });
        await contract.save();
        res.json(contract);
    }
    catch (error) {
        console.error('Contract upload error:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Hämta alla kontrakt
router.get('/', auth_1.auth, async (req, res) => {
    try {
        const contracts = await Contract_1.Contract.find().sort({ uploadDate: -1 });
        res.json(contracts);
    }
    catch (error) {
        console.error('Error fetching contracts:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Hämta ett specifikt kontrakt
router.get('/:id', auth_1.auth, (0, validation_1.validateObjectId)('id'), async (req, res) => {
    try {
        const contract = await Contract_1.Contract.findById(req.params.id);
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        res.json(contract);
    }
    catch (error) {
        console.error('Error fetching contract:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Ta bort ett avtal
router.delete('/:id', auth_1.auth, (0, auth_1.checkRole)(['admin', 'manager']), (0, validation_1.validateObjectId)('id'), async (req, res) => {
    try {
        const contract = await Contract_1.Contract.findById(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        await contract.deleteOne();
        res.json({ message: 'Contract deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting contract' });
    }
});
exports.default = router;
