import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error caught in error handler:', error);
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('Prisma Error Code:', error.code);
    console.error('Prisma Error Message:', error.message);
    
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'A record with this value already exists',
          details: error.message
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Record not found',
          details: error.message
        });
      default:
        return res.status(500).json({
          error: 'Database error',
          details: error.message
        });
    }
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error('Prisma Validation Error:', error.message);
    return res.status(400).json({
      error: 'Invalid data provided',
      details: error.message
    });
  }
  
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error('Prisma Initialization Error:', error.message);
    return res.status(500).json({
      error: 'Database connection error',
      details: error.message
    });
  }
  
  console.error('Unhandled Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: error.message
  });
};
