import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);
router.get('/google', AuthController.googleRedirect);
router.get('/google/callback', AuthController.googleCallback);

export { router as authRoutes };
