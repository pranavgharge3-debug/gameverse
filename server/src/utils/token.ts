import jwt from 'jsonwebtoken';
import { config } from '../config/appConfig';

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, config.jwtSecret);
}
