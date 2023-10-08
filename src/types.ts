import { z } from 'zod';

export type SimpleResponse = z.infer<typeof SimpleResponseSchema>;
export type Taint = z.infer<typeof TaintSchema>;

export const SimpleResponseSchema = z.object({
  id: z.string(),
  result: z.string(),
  code: z.string(),
  reason: z.string(),
  details: z.string(),
});

export const TaintSchema = z.object({
  /**
   * Required. The effect of the taint on pods that do not tolerate the taint. Valid effects are NoSchedule, PreferNoSchedule and NoExecute.
   */
  effect: z.string(),
  /**
   * Required. The taint key to be applied to a node.
   */
  key: z.string(),
  /**
   * TimeAdded represents the time at which the taint was added. It is only written for NoExecute taints.
   */
  timeAdded: z.string().optional(),
  /**
   * The taint value corresponding to the taint key.
   */
  value: z.string().optional(),
});

export function createPaginatedResponse<T>(schema: z.ZodType<T>) {
  return z.object({
    page: z.number(),
    per_page: z.number(),
    pages: z.number(),
    items: z.array(schema),
  });
}
