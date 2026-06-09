import { prisma } from '../prisma/client';

export class UserService {
  static async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        bio: true,
        favoriteGames: true,
        rank: true,
        level: true,
        xp: true,
        badges: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async updateProfile(userId: string, data: Partial<{ avatarUrl: string; bio: string; favoriteGames: string[]; rank: string; level: number; xp: number; badges: string[] }>) {
    return prisma.user.update({ where: { id: userId }, data });
  }

  static async searchUsers(query: string) {
    if (!query) return [];
    return prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, username: true, avatarUrl: true, rank: true, level: true },
      take: 20,
    });
  }
}
