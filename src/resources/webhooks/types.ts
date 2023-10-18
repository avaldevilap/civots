import { z } from 'zod';

export type Webhook = z.infer<typeof WebhookSchema>;
export type WebhookConfig = z.infer<typeof WebhookConfigSchema>;

// Webhook is a representation of a saved webhook callback from changes in Civo
export const WebhookSchema = z.object({
  id: z.string(),
  events: z.array(z.string()),
  url: z.string(),
  secret: z.string(),
  disabled: z.boolean(),
  failures: z.number(),
  last_failure_reason: z.string(),
});

// WebhookConfig represents the options required for creating a new webhook
export const WebhookConfigSchema = z.object({
  events: z.array(z.string()),
  url: z.string(),
  secret: z.string(),
});
export function isWebhookConfig(data: unknown): data is WebhookConfig {
  return WebhookConfigSchema.safeParse(data).success;
}
