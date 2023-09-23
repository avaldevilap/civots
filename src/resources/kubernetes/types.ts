import { z } from 'zod';

import { ClusterID, NoArgs } from '../../types';

export type Routes = {
  '/kubernetes/clusters': NoArgs;
  '/kubernetes/clusters/:clusterId': { clusterId: ClusterID };
};

export type KubernetesInstance = z.infer<typeof KubernetesInstanceSchema>;
export type KubernetesPool = z.infer<typeof KubernetesPoolSchema>;
export type KubernetesInstalledApplication = z.infer<
  typeof KubernetesInstalledApplicationSchema
>;
export type Condition = z.infer<typeof ConditionSchema>;
export type KubernetesCluster = z.infer<typeof KubernetesClusterSchema>;
export type RequiredPools = z.infer<typeof RequiredPoolsSchema>;
export type PaginatedKubernetesClusters = z.infer<
  typeof PaginatedKubernetesClustersSchema
>;
export type KubernetesClusterConfig = z.infer<
  typeof KubernetesClusterConfigSchema
>;
export type KubernetesClusterPoolConfig = z.infer<
  typeof KubernetesClusterPoolConfigSchema
>;
export type KubernetesPlanConfiguration = z.infer<
  typeof KubernetesPlanConfigurationSchema
>;
export type KubernetesMarketplacePlan = z.infer<
  typeof KubernetesMarketplacePlanSchema
>;
export type KubernetesMarketplaceApplication = z.infer<
  typeof KubernetesMarketplaceApplicationSchema
>;
export type KubernetesVersion = z.infer<typeof KubernetesVersionSchema>;

// KubernetesInstance represents a single node/master within a Kubernetes cluster
export const KubernetesInstanceSchema = z.object({
  id: z.string(),
  hostname: z.string().optional(),
  size: z.string().optional(),
  region: z.string().optional(),
  source_type: z.string().optional(),
  source_id: z.string().optional(),
  initial_user: z.string().optional(),
  initial_password: z.string().optional(),
  status: z.string().optional(),
  firewall_id: z.string().optional(),
  public_ip: z.string().optional(),
  cpu_cores: z.number().optional(),
  ram_mb: z.number().optional(),
  disk_gb: z.number().optional(),
  tags: z.array(z.string()).optional(),
  created_at: z.string().optional(),
  civostatsd_token: z.string().optional(),
});

// KubernetesPool represents a single pool within a Kubernetes cluster
export const KubernetesPoolSchema = z.object({
  id: z.string(),
  count: z.number().optional(),
  size: z.string().optional(),
  instance_names: z.array(z.string()).optional(),
  instances: z.array(KubernetesInstanceSchema).optional(),
  labels: z.record(z.string()).optional(),
  taints: z.array(z.string()).optional(),
  public_ip_node_pool: z.boolean().optional(),
});

// KubernetesInstalledApplication is an application within our marketplace available for
// installation
export const KubernetesInstalledApplicationSchema = z.object({
  application: z.string().optional(),
  name: z.string().optional(),
  version: z.string().optional(),
  dependencies: z.array(z.string()),
  maintainer: z.string().optional(),
  description: z.string().optional(),
  post_install: z.string().optional(),
  installed: z.boolean().optional(),
  url: z.string().url().optional(),
  category: z.string().optional(),
  updated_at: z.string().optional(),
  image_url: z.string().optional(),
  plan: z.string().optional(),
  configuration: z.record(z.string()).optional(),
});

// Condition is a condition for a Kubernetes cluster
export const ConditionSchema = z.object({
  type: z.string(),
  status: z.string(),
  synced: z.boolean(),
  last_transition_time: z.string(),
  reason: z.string().optional(),
  message: z.string().optional(),
});

// RequiredPools returns the required pools for a given Kubernetes cluster
export const RequiredPoolsSchema = z.object({
  id: z.string(),
  size: z.string(),
  count: z.number(),
  labels: z.record(z.string()).optional().nullable(),
  taints: z.array(z.string()).optional().nullable(),
  public_ip_node_pool: z.boolean().optional(),
});

// KubernetesCluster is a Kubernetes item inside the cluster
export const KubernetesClusterSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  generated_name: z.string().optional(),
  version: z.string().optional(),
  status: z.string().optional(),
  ready: z.boolean().optional(),
  cluster_type: z.string().optional(),
  num_target_nodes: z.number().optional(),
  target_nodes_size: z.string().optional(),
  built_at: z.string().optional(),
  kubeconfig: z.string().optional().nullable(),
  kubernetes_version: z.string().optional(),
  api_endpoint: z.string().optional(),
  master_ip: z.string().optional(),
  dns_entry: z.string().optional(),
  upgrade_available_to: z.string().optional(),
  legacy: z.boolean().optional(),
  network_id: z.string().optional(),
  namespace: z.string().optional(),
  tags: z.array(z.string()).optional(),
  created_at: z.string().optional(),
  instances: z.array(KubernetesInstanceSchema).optional(),
  pools: z.array(KubernetesPoolSchema).optional(),
  required_pools: z.array(RequiredPoolsSchema).optional().nullable(),
  installed_applications: z
    .array(KubernetesInstalledApplicationSchema)
    .optional()
    .nullable(),
  firewall_id: z.string().optional(),
  cni_plugin: z.string().optional(),
  ccm_installed: z.string().optional(),
  conditions: z.array(ConditionSchema),
});

// PaginatedKubernetesClusters is a Kubernetes k3s cluster
export const PaginatedKubernetesClustersSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  pages: z.number(),
  items: z.array(KubernetesClusterSchema),
});

// KubernetesClusterPoolConfig is used to create a new cluster pool
export const KubernetesClusterPoolConfigSchema = z.object({
  region: z.string().optional(),
  id: z.string().optional(),
  count: z.number().optional(),
  size: z.string().optional(),
  public_ip_node_pool: z.boolean().optional(),
});

// KubernetesClusterConfig is used to create a new cluster
export const KubernetesClusterConfigSchema = z.object({
  name: z.string().optional(),
  region: z.string().optional(),
  cluster_type: z.string().optional(),
  num_target_nodes: z.number().optional(),
  target_nodes_size: z.string().optional(),
  kubernetes_version: z.string().optional(),
  node_destroy: z.string().optional(),
  network_id: z.string().optional(),
  tags: z.string().optional(),
  pools: z.array(KubernetesClusterPoolConfigSchema).optional(),
  applications: z.string().optional(),
  instance_firewall: z.string().optional(),
  firewall_rule: z.string().optional(),
  cni_plugin: z.string().optional(),
});

// KubernetesPlanConfiguration is a value within a configuration for
// an application's plan
export const KubernetesPlanConfigurationSchema = z.object({
  value: z.string(),
});

export const KubernetesMarketplacePlanSchema = z.object({
  label: z.string(),
  configuration: z.record(KubernetesPlanConfigurationSchema),
});

// KubernetesMarketplaceApplication is an application within our marketplace
// available for installation
export const KubernetesMarketplaceApplicationSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  version: z.string(),
  default: z.boolean().optional(),
  dependencies: z.array(z.string()).optional(),
  maintainer: z.string(),
  description: z.string(),
  post_install: z.string(),
  url: z.string(),
  category: z.string(),
  plans: z.array(KubernetesMarketplacePlanSchema),
});

// KubernetesVersion represents an available version of k3s to install
export const KubernetesVersionSchema = z.object({
  label: z.string(),
  version: z.string(),
  type: z.string(),
  default: z.boolean().optional(),
  clusterType: z.string().optional(),
});
