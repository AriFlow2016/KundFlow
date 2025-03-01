import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  // För utveckling, skippa auth temporärt
  (req as AuthRequest).user = { id: 'dev-user', role: 'admin' };
  next();
  
  // Implementera detta senare för produktion:
  /*
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Ingen token tillhandahållen' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    (req as AuthRequest).user = decoded as { id: string; role: string };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ogiltig token' });
  }
  */
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;
    
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (roles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};
