import z from 'zod';

export type Action = z.infer<typeof ActionSchema>;
export type PaginateActionList = z.infer<typeof PaginateActionListSchema>;
export type ActionListRequest = z.infer<typeof ActionListRequestSchema>;

// Action is a struct for an individual action within the database and when serialized
export const ActionSchema = z.object({
  id: z.string(),
  account_id: z.string(),
  user_id: z.string(),
  type: z.string(),
  details: z.string().optional(),
  related_id: z.string().optional(),
  related_type: z.string().optional(),
  debug: z.boolean(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// PaginateActionList is a struct for a page of actions
export const PaginateActionListSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  pages: z.number(),
  items: z.array(ActionSchema),
});

// ActionListRequest is a struct for the request to list actions
export const ActionListRequestSchema = z.object({
  page: z.number().optional(),
  per_page: z.number().optional(),
  user_id: z.string().optional(),
  include_debug: z.boolean().optional(),
  resource_id: z.string().optional(),
  details: z.string().optional(),
  related_id: z.string().optional(),
  resource_type: z.string().optional(),
  action_type: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export function isActionListRequest(data: unknown): data is ActionListRequest {
  return ActionListRequestSchema.safeParse(data).success;
}
