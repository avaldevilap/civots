import { z } from 'zod';

export type Team = z.infer<typeof TeamSchema>;
export type TeamMember = z.infer<typeof TeamMemberSchema>;

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const TeamMemberSchema = z.object({
  id: z.string(),
  team_id: z.string().optional(),
  user_id: z.string().optional(),
  permissions: z.string().optional(),
  roles: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
