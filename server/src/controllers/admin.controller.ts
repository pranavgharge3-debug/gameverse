import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AdminService } from '../services/admin.service';

export class AdminController {
  static async listUsers(req: AuthRequest, res: Response) {
    const users = await AdminService.listUsers();
    res.status(200).json(users);
  }

  static async banUser(req: AuthRequest, res: Response) {
    const result = await AdminService.banUser(req.params.userId);
    res.status(200).json(result);
  }

  static async listReports(req: AuthRequest, res: Response) {
    const reports = await AdminService.listReports();
    res.status(200).json(reports);
  }

  static async moderateContent(req: AuthRequest, res: Response) {
    const result = await AdminService.moderateContent(req.params.contentId, req.body.action);
    res.status(200).json(result);
  }

  static async getAnalytics(req: AuthRequest, res: Response) {
    const analytics = await AdminService.getAnalytics();
    res.status(200).json(analytics);
  }
}
