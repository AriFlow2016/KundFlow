import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import customerRoutes from './routes/customerRoutes';
import healthRoutes from './routes/health';
import { errorHandler } from './middleware/error';
import path from 'path';

const app = express();
const prisma = new PrismaClient();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  next();
});

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://kundflow-frontend.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization']
};

console.log('Starting server with CORS Origin:', process.env.CORS_ORIGIN || 'https://kundflow-frontend.onrender.com');

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statiska filer
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.use('/health', healthRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test database connection
app.get('/api/dbtest', async (req, res) => {
  try {
    await prisma.$connect();
    res.status(200).json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

// Routes
app.use('/api/customers', customerRoutes);

// Error handling
app.use(errorHandler);

export default app;
