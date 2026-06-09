import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    favoriteGames: z.array(z.string()).optional(),
    rank: z.string().max(64).optional(),
    level: z.number().int().min(1).optional(),
    xp: z.number().int().min(0).optional(),
    badges: z.array(z.string()).optional(),
  }),
});
