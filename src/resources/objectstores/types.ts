import { z } from 'zod';

import { createPaginatedResponse } from '../../types';

export type ObjectStore = z.infer<typeof ObjectStoreSchema>;
export type BucketOwner = z.infer<typeof BucketOwnerSchema>;
export type PaginatedObjectStores = z.infer<typeof PaginatedObjectStoresSchema>;
export type CreateObjectStoreRequest = z.infer<
  typeof CreateObjectStoreRequestSchema
>;
export type UpdateObjectStoreRequest = z.infer<
  typeof UpdateObjectStoreRequestSchema
>;

// ObjectStore is the struct for the ObjectStore model
export const BucketOwnerSchema = z
  .object({
    access_key_id: z.string(),
    name: z.string(),
    credential_id: z.string(),
  })
  .optional();

// BucketOwner is the struct for owner details of an Object Store
export const ObjectStoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  max_size: z.number(),
  owner_info: BucketOwnerSchema,
  objectstore_endpoint: z.string(),
  status: z.string(),
});

// PaginatedObjectstores is a paginated list of Objectstores
export const PaginatedObjectStoresSchema =
  createPaginatedResponse(ObjectStoreSchema);

// CreateObjectStoreRequest holds the request to create a new object storage
export const CreateObjectStoreRequestSchema = z.object({
  name: z.string(),
  max_size_gb: z.number(),
  access_key_id: z.string(),
  region: z.string().optional(),
});
export function isCreateObjectStoreRequest(
  data: unknown,
): data is CreateObjectStoreRequest {
  return CreateObjectStoreRequestSchema.safeParse(data).success;
}

// UpdateObjectStoreRequest holds the request to update a specified object storage's details
export const UpdateObjectStoreRequestSchema = z.object({
  max_size_gb: z.number(),
  region: z.string().optional(),
});
export function isUpdateObjectStoreRequest(
  data: unknown,
): data is UpdateObjectStoreRequest {
  return UpdateObjectStoreRequestSchema.safeParse(data).success;
}
