import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, NotificationController.getNotifications);
router.post('/:notificationId/read', requireAuth, NotificationController.markAsRead);

export { router as notificationRoutes };
