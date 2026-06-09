import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validators/user.validator';

const router = Router();

router.get('/me', requireAuth, UserController.getProfile);
router.put('/me', requireAuth, validate(updateProfileSchema), UserController.updateProfile);
router.get('/search', requireAuth, UserController.searchUsers);

export { router as userRoutes };
