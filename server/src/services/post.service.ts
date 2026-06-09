import { prisma } from '../prisma/client';

export class PostService {
  static async getFeed() {
    return prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true, rank: true } },
        comments: { include: { author: { select: { id: true, username: true, avatarUrl: true } } } },
      },
      take: 30,
    });
  }

  static async createPost(userId: string, data: { content: string; mediaUrls?: string[]; tags?: string[] }) {
    return prisma.post.create({
      data: {
        authorId: userId,
        content: data.content,
        mediaUrls: data.mediaUrls || [],
        tags: data.tags || [],
      },
    });
  }

  static async createComment(userId: string, postId: string, content: string) {
    await prisma.post.update({ where: { id: postId }, data: { updatedAt: new Date() } });
    return prisma.comment.create({
      data: {
        authorId: userId,
        postId,
        content,
      },
      include: { author: { select: { id: true, username: true, avatarUrl: true } } },
    });
  }

  static async likePost(userId: string, postId: string) {
    // Like tracking is simplified; use event table for full history.
    return prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });
  }
}
