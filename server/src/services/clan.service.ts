import { prisma } from '../prisma/client';

export class ClanService {
  static async listClans(search?: string) {
    return prisma.clan.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { tag: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      include: { members: { include: { user: { select: { id: true, username: true, avatarUrl: true, rank: true } } } } },
      take: 40,
    });
  }

  static async createClan(userId: string, data: { name: string; tag: string; description: string; visibility?: 'PUBLIC' | 'PRIVATE' }) {
    const clan = await prisma.clan.create({
      data: {
        name: data.name,
        tag: data.tag,
        description: data.description,
        visibility: data.visibility ?? 'PUBLIC',
        ownerId: userId,
        members: { create: { userId, role: 'LEADER' } },
      },
    });
    return clan;
  }

  static async joinClan(userId: string, clanId: string) {
    const clan = await prisma.clan.findUnique({ where: { id: clanId } });
    if (!clan) throw { status: 404, message: 'Clan not found' };
    if (clan.visibility === 'PRIVATE') {
      throw { status: 403, message: 'Private clans require invitation' };
    }
    await prisma.clanMember.create({ data: { clanId, userId, role: 'MEMBER' } });
    return { status: 'success', message: 'Joined clan' };
  }

  static async getClan(clanId: string) {
    return prisma.clan.findUnique({
      where: { id: clanId },
      include: { members: { include: { user: { select: { id: true, username: true, avatarUrl: true, rank: true, level: true } } } } },
    });
  }

  static async getClanMembers(clanId: string) {
    return prisma.clanMember.findMany({
      where: { clanId },
      include: { user: { select: { id: true, username: true, avatarUrl: true, rank: true, level: true } } },
    });
  }
}
