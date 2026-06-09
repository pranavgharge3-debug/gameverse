import { Router } from 'express';
import { TournamentController } from '../controllers/tournament.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createTournamentSchema, joinTournamentSchema } from '../validators/tournament.validator';

const router = Router();

router.get('/', requireAuth, TournamentController.listTournaments);
router.post('/', requireAuth, validate(createTournamentSchema), TournamentController.createTournament);
router.post('/join', requireAuth, validate(joinTournamentSchema), TournamentController.joinTournament);
router.get('/:tournamentId', requireAuth, TournamentController.getTournament);

export { router as tournamentRoutes };
