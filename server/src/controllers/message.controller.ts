import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { MessageService } from '../services/message.service';

export class MessageController {
  static async sendMessage(req: AuthRequest, res: Response) {
    const message = await MessageService.sendMessage(req.user!.id, req.body);
    res.status(201).json(message);
  }

  static async getMessages(req: AuthRequest, res: Response) {
    const filters = {
      recipientId: req.query.recipientId as string,
      clanId: req.query.clanId as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };
    const messages = await MessageService.getMessages(req.user!.id, filters);
    res.status(200).json(messages);
  }

  static async markAsRead(req: AuthRequest, res: Response) {
    const message = await MessageService.markAsRead(req.params.messageId, req.user!.id);
    res.status(200).json(message);
  }

  static async getConversations(req: AuthRequest, res: Response) {
    const conversations = await MessageService.getConversations(req.user!.id);
    res.status(200).json(conversations);
  }

  static async getClanConversations(req: AuthRequest, res: Response) {
    const conversations = await MessageService.getClanConversations(req.user!.id);
    res.status(200).json(conversations);
  }
}
