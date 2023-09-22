import { z } from 'zod';

import { NoArgs } from '../../types';

export type Routes = {
  '/regions': NoArgs;
};

export type Region = z.infer<typeof RegionSchema>;
export type Feature = z.infer<typeof FeatureSchema>;

export const FeatureSchema = z.object({
  iaas: z.boolean(),
  kubernetes: z.boolean(),
  object_store: z.boolean(),
  loadbalancer: z.boolean(),
  dbaas: z.boolean(),
  volume: z.boolean(),
  paas: z.boolean(),
  kfaas: z.boolean(),
  public_ip_node_pools: z.boolean().optional(),
});

export const RegionSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: z.string(),
  out_of_capacity: z.boolean(),
  country: z.string(),
  country_name: z.string(),
  features: FeatureSchema,
  default: z.boolean(),
});
