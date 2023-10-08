import { z } from 'zod';

import { TaintSchema } from '../../types';

export type KubernetesClusterPoolUpdateConfig = z.infer<
  typeof KubernetesClusterPoolUpdateConfigSchema
>;

export const KubernetesClusterPoolUpdateConfigSchema = z.object({
  id: z.string(),
  count: z.number(),
  size: z.string(),
  label: z.record(z.string()),
  taints: z.array(TaintSchema),
  public_ip_node_pool: z.boolean().optional(),
  region: z.string().optional(),
});
