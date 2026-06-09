import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(2000),
    mediaUrls: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const commentSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(1000),
  }),
});
