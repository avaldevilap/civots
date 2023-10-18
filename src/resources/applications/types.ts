import { z } from 'zod';

export type EnvVar = z.infer<typeof EnvVarSchema>;
export type ProcessInfo = z.infer<typeof ProcessInfoSchema>;
export type Application = z.infer<typeof ApplicationSchema>;
export type ApplicationConfig = z.infer<typeof ApplicationConfigSchema>;
export type UpdateApplicationRequest = z.infer<
  typeof UpdateApplicationRequestSchema
>;
export type PaginatedApplications = z.infer<typeof PaginatedApplicationsSchema>;

export const EnvVarSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const ProcessInfoSchema = z.object({
  processType: z.string(),
  processCount: z.number(),
});

export const ApplicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  network_id: z.string(),
  description: z.string(),
  image: z.string(),
  size: z.string(),
  process_info: z.array(ProcessInfoSchema).optional(),
  domains: z.array(z.string()).optional(),
  ssh_key_ids: z.array(z.string()).optional(),
  config: z.array(EnvVarSchema).optional(),
  status: z.string(),
});

export const ApplicationConfigSchema = z.object({
  name: z.string(),
  network_id: z.string(),
  description: z.string(),
  size: z.string(),
  ssh_key_ids: z.array(z.string()).optional(),
});
export function isApplicationConfig(data: unknown): data is ApplicationConfig {
  return ApplicationConfigSchema.safeParse(data).success;
}

export const UpdateApplicationRequestSchema = z.object({
  name: z.string(),
  advanced: z.boolean(),
  image: z.string(),
  description: z.string(),
  process_info: z.array(ProcessInfoSchema),
  size: z.string(),
  ssh_key_ids: z.array(z.string()),
  config: z.array(EnvVarSchema),
  domains: z.array(z.string()),
});
export function isUpdateApplicationRequest(
  data: unknown,
): data is UpdateApplicationRequest {
  return UpdateApplicationRequestSchema.safeParse(data).success;
}

export const PaginatedApplicationsSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  pages: z.number(),
  items: z.array(ApplicationSchema),
});
