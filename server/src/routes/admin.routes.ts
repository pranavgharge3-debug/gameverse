import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.get('/users', AdminController.listUsers);
router.post('/users/:userId/ban', AdminController.banUser);
router.get('/reports', AdminController.listReports);
router.post('/content/:contentId/moderate', AdminController.moderateContent);
router.get('/analytics', AdminController.getAnalytics);

export { router as adminRoutes };
