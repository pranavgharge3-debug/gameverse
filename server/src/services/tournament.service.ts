import { prisma } from '../prisma/client';

export class TournamentService {
  static async listTournaments(search?: string) {
    return prisma.tournament.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { game: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      include: {
        organizer: { select: { id: true, username: true, avatarUrl: true } },
        participants: { include: { user: { select: { id: true, username: true, avatarUrl: true } } } },
      },
      orderBy: { startDate: 'desc' },
      take: 40,
    });
  }

  static async createTournament(userId: string, data: { title: string; description: string; game: string; type?: 'SINGLES' | 'DOUBLES' | 'TEAM'; startDate: string; endDate: string }) {
    return prisma.tournament.create({
      data: {
        title: data.title,
        description: data.description,
        game: data.game,
        type: data.type ?? 'SINGLES',
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        organizerId: userId,
      },
    });
  }

  static async joinTournament(userId: string, tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) throw { status: 404, message: 'Tournament not found' };
    if (new Date() > tournament.startDate) {
      throw { status: 400, message: 'Registration closed for this tournament' };
    }
    return prisma.tournamentParticipant.create({
      data: { tournamentId, userId },
    });
  }

  static async getTournament(tournamentId: string) {
    return prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        organizer: { select: { id: true, username: true, avatarUrl: true } },
        participants: { include: { user: { select: { id: true, username: true, avatarUrl: true } } } },
        leaderboard: { include: { user: { select: { id: true, username: true, avatarUrl: true } } } },
      },
    });
  }
}
