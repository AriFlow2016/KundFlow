import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Filen är för stor. Max storlek är 10MB.' });
    }
    return res.status(400).json({ message: 'Fel vid filuppladdning' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: 'Ett internt serverfel har inträffat' });
};
