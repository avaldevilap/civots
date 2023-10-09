import { z } from 'zod';

import { AccountSchema, OrganizationSchema } from '../organizations/types';
import { RoleSchema } from '../roles/types';
import { TeamSchema } from '../teams/types';

export type User = z.infer<typeof UserSchema>;
export type UserEverything = z.infer<typeof UserEverythingSchema>;

export const UserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  company_name: z.string(),
  email_address: z.string().email(),
  status: z.string(),
  flags: z.string(),
  token: z.string(),
  marketing_allowed: z.number(),
  default_account_id: z.string(),
  password_digest: z.string(),
  partner: z.string(),
  partner_user_id: z.string(),
  referral_id: z.string(),
  last_chosen_region: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const UserEverythingSchema = z.object({
  user: UserSchema,
  accounts: z.array(AccountSchema),
  organizations: z.array(OrganizationSchema),
  teams: z.array(TeamSchema),
  roles: z.array(RoleSchema),
});
