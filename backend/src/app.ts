import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import contractRoutes from './routes/contractRoutes';
import testRoutes from './routes/testRoutes';
import healthRoutes from './routes/healthRoutes';
import { errorHandler } from './middleware/error';
import path from 'path';

const app = express();

// Middleware
app.use(cors());
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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kundflow')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

export default app;
