import { z } from 'zod';

export const createTournamentSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(120),
    description: z.string().max(1200),
    game: z.string().min(2).max(64),
    type: z.enum(['SINGLES', 'DOUBLES', 'TEAM']).optional(),
    startDate: z.string(),
    endDate: z.string(),
  }),
});

export const joinTournamentSchema = z.object({
  body: z.object({
    tournamentId: z.string().cuid(),
  }),
});
