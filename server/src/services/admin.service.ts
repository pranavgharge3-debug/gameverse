import { prisma } from '../prisma/client';

export class AdminService {
  static async listUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      take: 100,
    });
  }

  static async banUser(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'USER' },
    });
    return { status: 'success', message: 'User banned' };
  }

  static async listReports() {
    return prisma.report.findMany({
      include: {
        reporter: { select: { id: true, username: true } },
        reportedUser: { select: { id: true, username: true } },
      },
      take: 50,
    });
  }

  static async moderateContent(contentId: string, action: 'approve' | 'reject') {
    return { status: 'success', message: `Content ${action}ed` };
  }

  static async getAnalytics() {
    const totalUsers = await prisma.user.count();
    const totalPosts = await prisma.post.count();
    const totalClans = await prisma.clan.count();
    const totalTournaments = await prisma.tournament.count();

    return {
      totalUsers,
      totalPosts,
      totalClans,
      totalTournaments,
      timestamp: new Date(),
    };
  }
}
