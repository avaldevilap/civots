import { z } from 'zod';

import { createPaginatedResponse } from '../../types';

export type Database = z.infer<typeof DatabaseSchema>;
export type PaginatedDatabases = z.infer<typeof PaginatedDatabasesSchema>;
export type CreateDatabaseRequest = z.infer<typeof CreateDatabaseRequestSchema>;
export type UpdateDatabaseRequest = z.infer<typeof UpdateDatabaseRequestSchema>;
export type SupportedSoftwareVersionS = z.infer<
  typeof SupportedSoftwareVersionSchema
>;
export type RestoreDatabaseRequest = z.infer<
  typeof RestoreDatabaseRequestSchema
>;
export type DatabaseBackup = z.infer<typeof DatabaseBackupSchema>;
export type DatabaseBackupCreateRequest = z.infer<
  typeof DatabaseBackupCreateRequestSchema
>;
export type DatabaseBackupUpdateRequest = z.infer<
  typeof DatabaseBackupUpdateRequestSchema
>;

// Database holds the database information
export const DatabaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  nodes: z.number(),
  size: z.string(),
  software: z.string(),
  software_version: z.string(),
  public_ipv4: z.string().ip({ version: 'v4' }),
  network_id: z.string(),
  firewall_id: z.string(),
  port: z.number(),
  username: z.string(),
  password: z.string(),
  status: z.string(),
});

// PaginatedDatabases is the structure for list response from DB endpoint
export const PaginatedDatabasesSchema = createPaginatedResponse(DatabaseSchema);

// CreateDatabaseRequest holds fields required to creates a new database
export const CreateDatabaseRequestSchema = z.object({
  name: z.string(),
  size: z.string(),
  software: z.string(),
  software_version: z.string(),
  network_id: z.string(),
  nodes: z.number(),
  firewall_id: z.string(),
  firewall_rule: z.string(),
  region: z.string(),
});
export function isCreateDatabaseRequest(
  data: unknown,
): data is CreateDatabaseRequest {
  return CreateDatabaseRequestSchema.safeParse(data).success;
}

// UpdateDatabaseRequest holds fields required to update a database
export const UpdateDatabaseRequestSchema = z
  .object({
    name: z.string(),
    nodes: z.number(),
    firewall_id: z.string(),
    region: z.string(),
  })
  .optional();
export function isUpdateDatabaseRequest(
  data: unknown,
): data is UpdateDatabaseRequest {
  return UpdateDatabaseRequestSchema.safeParse(data).success;
}

// SupportedSoftwareVersion contains the information related to a specific software version
export const SupportedSoftwareVersionSchema = z.object({
  software_version: z.string(),
  default: z.boolean(),
});

// RestoreDatabaseRequest is the request body for restoring a database
export const RestoreDatabaseRequestSchema = z.object({
  software: z.string(),
  network_id: z.string(),
  backup: z.string(),
  region: z.string(),
});
export function isRestoreDatabaseRequest(
  data: unknown,
): data is RestoreDatabaseRequest {
  return RestoreDatabaseRequestSchema.safeParse(data).success;
}

// DatabaseBackup represents a backup
export const DatabaseBackupSchema = z.object({
  name: z.string(),
  database_name: z.string(),
  database_id: z.string(),
  software: z.string(),
  schedule: z.string(),
  count: z.number(),
  backups: z.array(z.string()),
});

// DatabaseBackupCreateRequest represents a backup create request
export const DatabaseBackupCreateRequestSchema = z.object({
  name: z.string(),
  schedule: z.string(),
  count: z.number(),
  region: z.string(),
});
export function isDatabaseBackupCreateRequest(
  data: unknown,
): data is RestoreDatabaseRequest {
  return DatabaseBackupCreateRequestSchema.safeParse(data).success;
}

// DatabaseBackupUpdateRequest represents a backup update request
export const DatabaseBackupUpdateRequestSchema =
  DatabaseBackupCreateRequestSchema.optional();
export function isDatabaseBackupUpdateRequest(
  data: unknown,
): data is RestoreDatabaseRequest {
  return DatabaseBackupUpdateRequestSchema.safeParse(data).success;
}
