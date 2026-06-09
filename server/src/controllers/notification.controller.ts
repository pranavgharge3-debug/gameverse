import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
  static async getNotifications(req: AuthRequest, res: Response) {
    const notifications = await NotificationService.getNotifications(req.user!.id);
    res.status(200).json(notifications);
  }

  static async markAsRead(req: AuthRequest, res: Response) {
    const notification = await NotificationService.markAsRead(req.params.notificationId, req.user!.id);
    res.status(200).json(notification);
  }
}
