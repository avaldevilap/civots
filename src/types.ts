import { z } from 'zod';

export type SimpleResponse = z.infer<typeof SimpleResponseSchema>;

export const SimpleResponseSchema = z.object({
  id: z.string(),
  result: z.string(),
  code: z.string(),
  reason: z.string(),
  details: z.string(),
});

export function createPaginatedResponse<T>(schema: z.ZodType<T>) {
  return z.object({
    page: z.number(),
    per_page: z.number(),
    pages: z.number(),
    items: z.array(schema),
  });
}
