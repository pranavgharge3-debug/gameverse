import { Router } from 'express';
import { FriendController } from '../controllers/friend.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/request', requireAuth, FriendController.sendRequest);
router.post('/request/:requestId/accept', requireAuth, FriendController.acceptRequest);
router.post('/request/:requestId/reject', requireAuth, FriendController.rejectRequest);
router.get('/requests', requireAuth, FriendController.listRequests);
router.get('/list', requireAuth, FriendController.getFriends);

export { router as friendRoutes };
