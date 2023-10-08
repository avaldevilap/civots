import { z } from 'zod';

export type Role = z.infer<typeof RoleSchema>;

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  permissions: z.string().optional(),
  built_in: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
