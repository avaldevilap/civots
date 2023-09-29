import { z } from 'zod';

// DiskImage represents a DiskImage for launching instances from
export const DiskImageSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  version: z.string().optional(),
  state: z.string().optional(),
  distribution: z.string().optional(),
  description: z.string().optional(),
  label: z.string().optional(),
});
