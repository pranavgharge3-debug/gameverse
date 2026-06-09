import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PostService } from '../services/post.service';

export class PostController {
  static async getFeed(req: AuthRequest, res: Response) {
    const feed = await PostService.getFeed();
    res.status(200).json(feed);
  }

  static async createPost(req: AuthRequest, res: Response) {
    const post = await PostService.createPost(req.user!.id, req.body);
    res.status(201).json(post);
  }

  static async createComment(req: AuthRequest, res: Response) {
    const comment = await PostService.createComment(req.user!.id, req.params.postId, req.body.content);
    res.status(201).json(comment);
  }

  static async likePost(req: AuthRequest, res: Response) {
    const post = await PostService.likePost(req.user!.id, req.params.postId);
    res.status(200).json(post);
  }
}
