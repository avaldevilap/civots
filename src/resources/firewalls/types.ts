import { z } from 'zod';

export type Firewall = z.infer<typeof FirewallSchema>;
export type FirewallRule = z.infer<typeof FirewallRuleSchema>;
export type FirewallResult = z.infer<typeof FirewallResultSchema>;
export type FirewallRuleConfig = z.infer<typeof FirewallRuleConfigSchema>;
export type FirewallConfig = z.infer<typeof FirewallConfigSchema>;

// FirewallRule represents a single rule for a given firewall, regarding
// which ports to open and which protocol, to which CIDR
export const FirewallRuleSchema = z.object({
  id: z.string().optional(),
  firewall_id: z.string().optional(),
  protocol: z.string(),
  start_port: z.string(),
  end_port: z.string(),
  cidr: z.array(z.string()),
  direction: z.string(),
  action: z.string(),
  label: z.string().optional(),
  ports: z.string().optional(),
});

// Firewall represents list of rule in Civo's infrastructure
export const FirewallSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  rules_count: z.string().optional(),
  instance_count: z.number(),
  cluster_count: z.number(),
  loadbalancer_count: z.number(),
  network_id: z.string().optional(),
  rules: z.array(FirewallRuleSchema).optional(),
});

// FirewallResult is the response from the Civo Firewall APIs
export const FirewallResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  result: z.string(),
});

// FirewallRuleConfig is how you specify the details when creating a new rule
export const FirewallRuleConfigSchema = z.object({
  firewall_id: z.string(),
  region: z.string(),
  protocol: z.string(),
  start_port: z.string(),
  end_port: z.string(),
  cidr: z.array(z.string()),
  direction: z.string(),
  action: z.string(),
  label: z.string().optional(),
  // Ports will be chosen over StartPort,EndPort if both are provided
  ports: z.string().optional(),
});
export function isFirewallRuleConfig(
  data: unknown,
): data is FirewallRuleConfig {
  return FirewallRuleConfigSchema.safeParse(data).success;
}

// FirewallConfig is how you specify the details when creating a new firewall
export const FirewallConfigSchema = z.object({
  name: z.string(),
  region: z.string(),
  network_id: z.string(),
  // CreateRules if not send the value will be nil, that mean the default rules will be created
  create_rules: z.boolean().optional(),
  rules: z.array(FirewallRuleSchema).optional(),
});
export function isFirewallConfig(data: unknown): data is FirewallConfig {
  return FirewallConfigSchema.safeParse(data).success;
}
