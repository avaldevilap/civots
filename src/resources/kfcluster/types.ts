import { z } from 'zod';

import { createPaginatedResponse } from '../../types';

export type KfCluster = z.infer<typeof KfClusterSchema>;
export type CreateKfClusterReq = z.infer<typeof CreateKfClusterReqSchema>;
export type UpdateKfClusterReq = z.infer<typeof UpdateKfClusterReqSchema>;
export type PaginatedKfClusters = z.infer<typeof PaginatedKfClustersSchema>;

// KfCluster represents a cluster with Kubeflow installed.
export const KfClusterSchema = z.object({
  id: z.string(),
  name: z.string(),
  network_id: z.string(),
  firewall_id: z.string(),
  size: z.string(),
  kubeflow_ready: z.string(),
  dashboard_url: z.string(),
  created_at: z.string(),
});
export function isKfCluster(data: unknown): data is KfCluster {
  return KfClusterSchema.safeParse(data).success;
}

// CreateKfClusterReq is the request for creating a KfCluster.
export const CreateKfClusterReqSchema = z.object({
  name: z.string(),
  network_id: z.string(),
  firewall_id: z.string(),
  size: z.string(),
  region: z.string().optional(),
});
export function isCreateKfClusterReq(
  data: unknown,
): data is CreateKfClusterReq {
  return CreateKfClusterReqSchema.safeParse(data).success;
}

// UpdateKfClusterReq is the request for updating a KfCluster.
export const UpdateKfClusterReqSchema = z.object({
  name: z.string(),
  region: z.string().optional(),
});
export function isUpdateKfClusterReq(
  data: unknown,
): data is UpdateKfClusterReq {
  return UpdateKfClusterReqSchema.safeParse(data).success;
}

// PaginatedKfClusters returns a paginated list of KfCluster object
export const PaginatedKfClustersSchema =
  createPaginatedResponse(KfClusterSchema);
