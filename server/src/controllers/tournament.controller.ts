import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TournamentService } from '../services/tournament.service';

export class TournamentController {
  static async listTournaments(req: AuthRequest, res: Response) {
    const tournaments = await TournamentService.listTournaments(req.query.search as string);
    res.status(200).json(tournaments);
  }

  static async createTournament(req: AuthRequest, res: Response) {
    const tournament = await TournamentService.createTournament(req.user!.id, req.body);
    res.status(201).json(tournament);
  }

  static async joinTournament(req: AuthRequest, res: Response) {
    const payload = await TournamentService.joinTournament(req.user!.id, req.body.tournamentId);
    res.status(200).json(payload);
  }

  static async getTournament(req: AuthRequest, res: Response) {
    const tournament = await TournamentService.getTournament(req.params.tournamentId);
    res.status(200).json(tournament);
  }
}
