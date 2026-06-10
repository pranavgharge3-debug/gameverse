import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { sendMessageSchema, getMessagesSchema } from '../validators/message.validator';

const router = Router();

router.use(requireAuth);

router.post('/', validate(sendMessageSchema), MessageController.sendMessage);
router.get('/', validate(getMessagesSchema), MessageController.getMessages);
router.patch('/:messageId/read', MessageController.markAsRead);
router.get('/conversations', MessageController.getConversations);
router.get('/conversations/clans', MessageController.getClanConversations);

export { router as messageRoutes };
