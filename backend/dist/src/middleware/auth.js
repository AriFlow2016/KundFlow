"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.auth = void 0;
const auth = (req, res, next) => {
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
      (req as AuthRequest).user = decoded as { id: string; role: string };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Ogiltig token' });
    }
    */
};
exports.auth = auth;
const checkRole = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (roles.includes(user.role)) {
            next();
        }
        else {
            res.status(403).json({ message: 'Forbidden' });
        }
    };
};
exports.checkRole = checkRole;
