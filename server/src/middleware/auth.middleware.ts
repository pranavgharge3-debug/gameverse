import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/token';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token) as { id: string; role: string };
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
}

export function requireRole(role: 'ADMIN' | 'MODERATOR' | 'USER') {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    if (req.user.role !== role && req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    return next();
  };
}
