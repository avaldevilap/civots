import { z } from 'zod';

export type Organization = z.infer<typeof OrganizationSchema>;
export type Account = z.infer<typeof AccountSchema>;

// Organisation represents a group of accounts treated as a single entity
export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  token: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

/**
 * Account is the owner of Civo resources such as instances, Kubernetes clusters, volumes, etc
 * Really the Account should be defined with Account endpoints, but there aren't any that are
 * publicly-useful
 */
export const AccountSchema = z.object({
  id: z.string().uuid(),
  label: z.string().optional(),
  email_address: z.string().email().optional(),
  api_key: z.string().optional(),
  token: z.string().optional(),
  flags: z.string().optional(),
  timezone: z.string().optional(),
  partner: z.string().optional(),
  default_user_id: z.string().optional(),
  status: z.string().optional(),
  email_confirmed: z.boolean().optional(),
  credit_card_added: z.boolean().optional(),
  enabled: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
