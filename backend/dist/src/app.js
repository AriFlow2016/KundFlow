"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const contractRoutes_1 = __importDefault(require("./routes/contractRoutes"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const error_1 = require("./middleware/error");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Statiska filer
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/contracts', contractRoutes_1.default);
app.use('/api/test', testRoutes_1.default);
app.use('/api/health', healthRoutes_1.default);
// Error handling
app.use(error_1.errorHandler);
// MongoDB connection
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kundflow')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
exports.default = app;
