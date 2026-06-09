import { Router } from 'express';
import { ClanController } from '../controllers/clan.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createClanSchema, joinClanSchema } from '../validators/clan.validator';

const router = Router();

router.get('/', requireAuth, ClanController.listClans);
router.post('/', requireAuth, validate(createClanSchema), ClanController.createClan);
router.post('/join', requireAuth, validate(joinClanSchema), ClanController.joinClan);
router.get('/:clanId', requireAuth, ClanController.getClan);
router.get('/:clanId/members', requireAuth, ClanController.getClanMembers);

export { router as clanRoutes };
