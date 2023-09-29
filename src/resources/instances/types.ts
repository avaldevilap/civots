import { z } from 'zod';

import { SubnetSchema } from '../networks/types';

export type Instance = z.infer<typeof InstanceSchema>;
export type InstanceConsole = z.infer<typeof InstanceConsoleSchema>;
export type PaginatedInstanceList = z.infer<typeof PaginatedInstanceListSchema>;
export type InstanceConfig = z.infer<typeof InstanceConfigSchema>;

// Instance represents a virtual server within Civo's infrastructure
export const InstanceSchema = z.object({
  id: z.string(),
  openstack_server_id: z.string(),
  hostname: z.string(),
  reverse_dns: z.string(),
  size: z.string(),
  region: z.string(),
  network_id: z.string(),
  private_ip: z.string(),
  public_ip: z.string(),
  ipv6: z.string(),
  pseudo_ip: z.string(),
  template_id: z.string(),
  source_type: z.string(),
  source_id: z.string(),
  snapshot_id: z.string(),
  initial_user: z.string(),
  initial_password: z.string(),
  ssh_key: z.string(),
  ssh_key_id: z.string(),
  status: z.string(),
  notes: z.string(),
  firewall_id: z.string(),
  tags: z.array(z.string()),
  civostatsd_token: z.string(),
  civostatsd_stats: z.string(),
  civostatsd_stats_per_minute: z.array(z.string()),
  civostatsd_stats_per_hour: z.array(z.string()),
  openstack_image_id: z.string(),
  rescue_password: z.string(),
  volume_backed: z.boolean(),
  cpu_cores: z.number(),
  ram_mb: z.number(),
  disk_gb: z.number(),
  gpu_count: z.number(),
  gpu_type: z.string(),
  script: z.string(),
  created_at: z.string(),
  reserved_ip_id: z.string(),
  reserved_ip_name: z.string(),
  reserved_ip: z.string(),
  subnets: z.array(SubnetSchema),
});

// InstanceConsole represents a link to a webconsole for an instances
export const InstanceConsoleSchema = z.object({
  url: z.string().url(),
});

// PaginatedInstanceList returns a paginated list of Instance object
export const PaginatedInstanceListSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  pages: z.number(),
  items: z.array(InstanceSchema),
});

// InstanceConfig describes the parameters for a new instance
// none of the fields are mandatory and will be automatically
// set with default values
export const InstanceConfigSchema = z.object({
  count: z.number(),
  hostname: z.string(),
  reverse_dns: z.string(),
  size: z.string(),
  region: z.string(),
  public_ip: z.string(),
  network_id: z.string(),
  template_id: z.string(),
  source_type: z.string().optional(),
  source_id: z.string().optional(),
  snapshot_id: z.string(),
  subnets: z.array(z.string()).optional(),
  initial_user: z.string(),
  ssh_key_id: z.string(),
  script: z.string(),
  tags: z.array(z.string()),
  firewall_id: z.string(),
});
export function isInstanceConfig(data: unknown): data is InstanceConfig {
  return InstanceConfigSchema.safeParse(data).success;
}
