import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import contractRoutes from './routes/contractRoutes';
import testRoutes from './routes/testRoutes';
import healthRoutes from './routes/healthRoutes';
import { errorHandler } from './middleware/error';
import path from 'path';

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://kundflow-frontend.onrender.com', 'https://kundflow.se']
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statiska filer
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/contracts', contractRoutes);
app.use('/api/test', testRoutes);
app.use('/api/health', healthRoutes);

// Error handling
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/kundflow')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

export default app;
