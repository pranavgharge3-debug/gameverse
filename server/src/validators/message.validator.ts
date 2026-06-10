import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    recipientId: z.string().cuid().optional(),
    clanId: z.string().cuid().optional(),
    content: z.string().min(1).max(2000),
    mediaUrls: z.array(z.string().url()).optional(),
  }),
});

export const getMessagesSchema = z.object({
  query: z.object({
    recipientId: z.string().cuid().optional(),
    clanId: z.string().cuid().optional(),
    limit: z.string().optional(),
    offset: z.string().optional(),
  }),
});
