import { z } from 'zod';

export type Charge = z.infer<typeof ChargeSchema>;

export const ChargeSchema = z.object({
  code: z.string(),
  label: z.string(),
  from: z.string(),
  to: z.string(),
  num_hours: z.number(),
  size_gb: z.number(),
});
