import { z } from 'zod';

import { createPaginatedResponse } from '../../types';

export type IP = z.infer<typeof IPSchema>;
export type AssignedTo = z.infer<typeof AssignedToSchema>;
export type CreateIPRequest = z.infer<typeof CreateIPRequestSchema>;
export type PaginatedIPs = z.infer<typeof PaginatedIPsSchema>;
export type UpdateIPRequest = z.infer<typeof UpdateIPRequestSchema>;
export type Actions = z.infer<typeof ActionsSchema>;

// AssignedTo represents IP assigned to resource
export const AssignedToSchema = z.object({
  id: z.string(),
  // Type can be one of the following:
  // - instance
  // - loadbalancer
  type: z.string(),
  name: z.string(),
});

// IP represents a serialized structure
export const IPSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  ip: z.string().optional(),
  assigned_to: AssignedToSchema.optional(),
});

// CreateIPRequest is a struct for creating an IP
export const CreateIPRequestSchema = z.object({
  // Name is an optional parameter. If not provided, name will be the IP address
  name: z.string().optional(),

  // Region is the region the IP will be created in
  region: z.string(),
});
export function isCreateIPRequest(data: unknown): data is CreateIPRequest {
  return CreateIPRequestSchema.safeParse(data).success;
}

// PaginatedIPs is a paginated list of IPs
export const PaginatedIPsSchema = createPaginatedResponse(IPSchema);

// UpdateIPRequest is a struct for creating an IP
export const UpdateIPRequestSchema = z.object({
  name: z.string(),
  // Region is the region the IP will be created in
  region: z.string(),
});
export function isUpdateIPRequest(data: unknown): data is UpdateIPRequest {
  return UpdateIPRequestSchema.safeParse(data).success;
}

// Actions for IP
export const ActionsSchema = z.object({
  // Action is one of "assign", "unassign"
  action: z.enum(['assign', 'unassign']),
  assign_to_id: z.string().optional(),
  assign_to_type: z.string().optional(),
  // Region is the region the IP will be created in
  region: z.string(),
});
