import { z } from 'zod';

export type LoadBalancer = z.infer<typeof LoadBalancerSchema>;
export type LoadBalancerBackend = z.infer<typeof LoadBalancerBackendSchema>;
export type LoadBalancerBackendConfig = z.infer<
  typeof LoadBalancerBackendConfigSchema
>;
export type LoadBalancerConfig = z.infer<typeof LoadBalancerConfigSchema>;
export type LoadBalancerUpdateConfig = z.infer<
  typeof LoadBalancerUpdateConfigSchema
>;

// LoadBalancerBackend represents a backend instance being load-balanced
export const LoadBalancerBackendSchema = z.object({
  ip: z.string().ip(),
  protocol: z.string().optional(),
  source_port: z.number(),
  target_port: z.number(),
  health_check_port: z.number(),
});

// LoadBalancerBackendConfig is the configuration for creating backends
export const LoadBalancerBackendConfigSchema = z.object({
  ip: z.string().ip(),
  protocol: z.string().optional(),
  source_port: z.number(),
  target_port: z.number(),
  health_check_port: z.number().optional(),
});

// LoadBalancerOptions are additional loadbalancer options
export const LoadBalancerOptionsSchema = z.object({
  server_timeout: z.string().optional(),
  client_timeout: z.string().optional(),
});

// LoadBalancer represents a load balancer configuration within Civo
export const LoadBalancerSchema = z.object({
  id: z.string(),
  name: z.string(),
  algorithm: z.string(),
  backends: z.array(LoadBalancerBackendSchema),
  external_traffic_policy: z.string().optional(),
  session_affinity: z.string().optional(),
  session_affinity_config_timeout: z.number().optional(),
  enable_proxy_protocol: z.string().optional(),
  public_ip: z.string().ip(),
  private_ip: z.string().ip(),
  firewall_id: z.string(),
  cluster_id: z.string().optional(),
  state: z.string(),
  reserved_ip_id: z.string().optional(),
  reserved_ip_name: z.string().optional(),
  reserved_ip: z.string().ip().optional(),
  max_concurrent_requests: z.number().optional(),
  options: LoadBalancerOptionsSchema.optional(),
});

// LoadBalancerConfig represents a load balancer to be created
export const LoadBalancerConfigSchema = z.object({
  region: z.string().optional(),
  name: z.string(),
  network_id: z.string(),
  algorithm: z.string().optional(),
  backends: z.array(LoadBalancerBackendConfigSchema),
  external_traffic_policy: z.string().optional(),
  session_affinity: z.string().optional(),
  session_affinity_config_timeout: z.number().optional(),
  enable_proxy_protocol: z.string().optional(),
  cluster_id: z.string().optional(),
  firewall_id: z.string().optional(),
  firewall_rule: z.string().optional(),
  max_concurrent_requests: z.number().optional(),
  options: LoadBalancerOptionsSchema.optional(),
});
export function isLoadBalancerConfig(
  data: unknown,
): data is LoadBalancerConfig {
  return LoadBalancerConfigSchema.safeParse(data).success;
}

// LoadBalancerUpdateConfig represents a load balancer to be updated
export const LoadBalancerUpdateConfigSchema = z.object({
  region: z.string().optional(),
  name: z.string().optional(),
  algorithm: z.string().optional(),
  backends: z.array(LoadBalancerBackendConfigSchema),
  external_traffic_policy: z.string().optional(),
  session_affinity: z.string().optional(),
  session_affinity_config_timeout: z.number().optional(),
  enable_proxy_protocol: z.string().optional(),
  firewall_id: z.string().optional(),
  max_concurrent_requests: z.number().optional(),
  options: LoadBalancerOptionsSchema.optional(),
});
export function isLoadBalancerUpdateConfig(
  data: unknown,
): data is LoadBalancerUpdateConfig {
  return LoadBalancerUpdateConfigSchema.safeParse(data).success;
}
