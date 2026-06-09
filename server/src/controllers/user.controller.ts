import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response) {
    const profile = await UserService.getProfile(req.user!.id);
    res.status(200).json(profile);
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    const profile = await UserService.updateProfile(req.user!.id, req.body);
    res.status(200).json(profile);
  }

  static async searchUsers(req: AuthRequest, res: Response) {
    const users = await UserService.searchUsers(req.query.q as string);
    res.status(200).json(users);
  }
}
