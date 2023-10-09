import { z } from 'zod';

export type SSHKey = z.infer<typeof SSHKeySchema>;

export const SSHKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  fingerprint: z.string(),
  public_key: z.string(),
  created_at: z.string().optional(),
});
