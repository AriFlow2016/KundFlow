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
const Contract_1 = require("../models/Contract");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const uploadService_1 = require("../services/uploadService");
const localFileService_1 = require("../services/localFileService");
const router = express_1.default.Router();
// Hämta alla avtal för en kund
router.get('/customer/:customerId', auth_1.auth, (0, validation_1.validateObjectId)('customerId'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contracts = yield Contract_1.Contract.find({ customerId: req.params.customerId })
            .sort({ endDate: 1 });
        res.json(contracts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching contracts' });
    }
}));
// Ladda upp ett nytt avtal
router.post('/upload', auth_1.auth, (0, auth_1.checkRole)(['admin', 'manager']), uploadService_1.upload.single('document'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const result = yield localFileService_1.localFileService.uploadFile(req.file);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error uploading file' });
    }
}));
// Ta bort ett avtal
router.delete('/:id', auth_1.auth, (0, auth_1.checkRole)(['admin', 'manager']), (0, validation_1.validateObjectId)('id'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = yield Contract_1.Contract.findById(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        yield contract.deleteOne();
        res.json({ message: 'Contract deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting contract' });
    }
}));
exports.default = router;
