import { z } from 'zod';

export type Volume = z.infer<typeof VolumeSchema>;
export type VolumeResult = z.infer<typeof VolumeResultSchema>;
export type VolumeConfig = z.infer<typeof VolumeConfigSchema>;

// Volume is a block of attachable storage for our IAAS products
// https://www.civo.com/api/volumes
export const VolumeSchema = z.object({
  id: z.string(),
  name: z.string(),
  instance_id: z.string(),
  cluster_id: z.string(),
  network_id: z.string(),
  mountpoint: z.string(),
  status: z.string(),
  size_gb: z.number(),
  bootable: z.boolean(),
  created_at: z.string(),
});

// VolumeResult is the response from one of our simple API calls
export const VolumeResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  result: z.string(),
});

// VolumeConfig are the settings required to create a new Volume
export const VolumeConfigSchema = z.object({
  name: z.string(),
  namespace: z.string(),
  cluster_id: z.string(),
  network_id: z.string(),
  region: z.string(),
  size_gb: z.number(),
  bootable: z.boolean(),
});
export function isVolumeConfig(data: unknown): data is VolumeConfig {
  return VolumeConfigSchema.safeParse(data).success;
}
