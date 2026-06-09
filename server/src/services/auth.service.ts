import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';
import { signToken } from '../utils/token';
import { sendPasswordResetEmail } from './email.service';

const saltRounds = 12;

export class AuthService {
  static async register(data: { email: string; username: string; password: string }) {
    const existing = await prisma.user.findFirst({ where: { OR: [{ email: data.email }, { username: data.username }] } });
    if (existing) {
      throw { status: 409, message: 'Email or username already exists' };
    }
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
      },
      select: { id: true, email: true, username: true, role: true, createdAt: true },
    });
    const token = signToken({ id: user.id, role: user.role });
    return { user, token };
  }

  static async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw { status: 401, message: 'Invalid credentials' };
    }
    const token = signToken({ id: user.id, role: user.role });
    return { user: { id: user.id, email: user.email, username: user.username, role: user.role }, token };
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;
    const resetToken = signToken({ id: user.id, type: 'reset' });
    await sendPasswordResetEmail(email, resetToken);
  }

  static async resetPassword(token: string, password: string) {
    const payload = signToken.verify ? null : null;
    try {
      const decoded = (await import('../utils/token')).verifyToken(token) as { id: string; type?: string };
      if (decoded.type !== 'reset') {
        throw new Error('Invalid reset token');
      }
      const hashed = await bcrypt.hash(password, saltRounds);
      await prisma.user.update({ where: { id: decoded.id }, data: { password: hashed } });
    } catch (error) {
      throw { status: 400, message: 'Invalid or expired reset token' };
    }
  }

  static getGoogleAuthUrl() {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      redirect_uri: process.env.GOOGLE_CALLBACK_URL || '',
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  static async handleGoogleCallback(code: string) {
    if (!code) {
      throw { status: 400, message: 'Missing Google auth code' };
    }
    return { status: 'success', message: 'Google login is configured', code };
  }
}
