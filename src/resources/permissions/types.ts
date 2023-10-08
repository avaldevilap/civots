import { z } from 'zod';

export type Permission = z.infer<typeof PermissionSchema>;

export const PermissionSchema = z.object({
  code: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});
