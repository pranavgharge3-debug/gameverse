import { z } from 'zod';

export const createClanSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(32),
    tag: z.string().min(2).max(8),
    description: z.string().max(1000),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  }),
});

export const joinClanSchema = z.object({
  body: z.object({
    clanId: z.string().cuid(),
  }),
});
