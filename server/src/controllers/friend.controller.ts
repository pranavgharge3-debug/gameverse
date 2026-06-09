import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { FriendService } from '../services/friend.service';

export class FriendController {
  static async sendRequest(req: AuthRequest, res: Response) {
    const request = await FriendService.sendRequest(req.user!.id, req.body.targetUserId);
    res.status(201).json(request);
  }

  static async acceptRequest(req: AuthRequest, res: Response) {
    const result = await FriendService.acceptRequest(req.user!.id, req.params.requestId);
    res.status(200).json(result);
  }

  static async rejectRequest(req: AuthRequest, res: Response) {
    const result = await FriendService.rejectRequest(req.user!.id, req.params.requestId);
    res.status(200).json(result);
  }

  static async listRequests(req: AuthRequest, res: Response) {
    const requests = await FriendService.listRequests(req.user!.id);
    res.status(200).json(requests);
  }

  static async getFriends(req: AuthRequest, res: Response) {
    const friends = await FriendService.getFriends(req.user!.id);
    res.status(200).json(friends);
  }
}
