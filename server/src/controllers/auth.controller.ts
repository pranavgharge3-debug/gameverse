import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    const payload = await AuthService.register(req.body);
    res.status(201).json(payload);
  }

  static async login(req: Request, res: Response) {
    const payload = await AuthService.login(req.body);
    res.status(200).json(payload);
  }

  static async forgotPassword(req: Request, res: Response) {
    await AuthService.forgotPassword(req.body.email);
    res.status(200).json({ status: 'success', message: 'Password reset email queued' });
  }

  static async resetPassword(req: Request, res: Response) {
    await AuthService.resetPassword(req.body.token, req.body.password);
    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  }

  static googleRedirect(_req: Request, res: Response) {
    const url = AuthService.getGoogleAuthUrl();
    res.redirect(url);
  }

  static async googleCallback(req: Request, res: Response) {
    const result = await AuthService.handleGoogleCallback(req.query.code as string);
    res.status(200).json(result);
  }
}
