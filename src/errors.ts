import { z } from 'zod';

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

const ErrorResponseSchema = z.object({ code: z.string(), reason: z.string() });

export function isErrorResponse(data: unknown): data is ErrorResponse {
  return ErrorResponseSchema.safeParse(data).success;
}

export class ResponseError extends Error {
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}
