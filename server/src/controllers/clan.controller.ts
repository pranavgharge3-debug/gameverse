import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ClanService } from '../services/clan.service';

export class ClanController {
  static async listClans(req: AuthRequest, res: Response) {
    const clans = await ClanService.listClans(req.query.search as string);
    res.status(200).json(clans);
  }

  static async createClan(req: AuthRequest, res: Response) {
    const clan = await ClanService.createClan(req.user!.id, req.body);
    res.status(201).json(clan);
  }

  static async joinClan(req: AuthRequest, res: Response) {
    const result = await ClanService.joinClan(req.user!.id, req.body.clanId);
    res.status(200).json(result);
  }

  static async getClan(req: AuthRequest, res: Response) {
    const clan = await ClanService.getClan(req.params.clanId);
    res.status(200).json(clan);
  }

  static async getClanMembers(req: AuthRequest, res: Response) {
    const members = await ClanService.getClanMembers(req.params.clanId);
    res.status(200).json(members);
  }
}
