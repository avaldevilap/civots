import { z } from 'zod';

import { createPaginatedResponse } from '../../types';

export type ObjectStoreCredential = z.infer<typeof ObjectStoreCredentialSchema>;
export type PaginatedObjectStoreCredentials = z.infer<
  typeof PaginatedObjectStoreCredentialsSchema
>;
export type CreateObjectStoreCredentialRequest = z.infer<
  typeof CreateObjectStoreCredentialRequestSchema
>;
export type UpdateObjectStoreCredentialRequest = z.infer<
  typeof UpdateObjectStoreCredentialRequestSchema
>;

export const ObjectStoreCredentialSchema = z.object({
  id: z.string(),
  name: z.string(),
  access_key_id: z.string(),
  secret_access_key_id: z.string(),
  max_size_gb: z.number(),
  suspended: z.boolean(),
  status: z.string(),
});

export const PaginatedObjectStoreCredentialsSchema = createPaginatedResponse(
  ObjectStoreCredentialSchema,
);

export const CreateObjectStoreCredentialRequestSchema = z.object({
  name: z.string(),
  access_key_id: z.string(),
  secret_access_key_id: z.string(),
  max_size_gb: z.number().optional(),
  region: z.string().optional(),
});
export function isCreateObjectStoreCredentialRequest(
  data: unknown,
): data is CreateObjectStoreCredentialRequest {
  return CreateObjectStoreCredentialRequestSchema.safeParse(data).success;
}

export const UpdateObjectStoreCredentialRequestSchema = z.object({
  access_key_id: z.string(),
  secret_access_key_id: z.string(),
  max_size_gb: z.number(),
  region: z.string().optional(),
});
export function isUpdateObjectStoreCredentialRequest(
  data: unknown,
): data is UpdateObjectStoreCredentialRequest {
  return UpdateObjectStoreCredentialRequestSchema.safeParse(data).success;
}
