import { z } from 'zod';

export type SimpleResponse = z.infer<typeof SimpleResponseSchema>;

export const SimpleResponseSchema = z.object({
  id: z.string(),
  result: z.string(),
  code: z.string(),
  reason: z.string(),
  details: z.string(),
});
