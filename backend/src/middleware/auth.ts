import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  // För utveckling, skippa auth temporärt
  req.user = { id: 'dev-user', role: 'admin' };
  next();
  
  // Implementera detta senare för produktion:
  /*
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Ingen token tillhandahållen' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded as { id: string; role: string };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ogiltig token' });
  }
  */
};

export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Inte autentiserad' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Otillräckliga behörigheter' });
    }

    next();
  };
};
