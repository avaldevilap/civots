import { z } from 'zod';

import { isErrorResponse, ResponseError } from '../errors';

type RegionCode = string;

export type Config = {
  apiKey: string;
  regionCode?: RegionCode;
};

export abstract class Base {
  private baseUrl: string;
  private apiVersion: string;
  protected apiKey: string;
  protected regionCode: RegionCode;

  constructor(config: Config) {
    this.baseUrl = import.meta.env.API_URL || 'https://api.civo.com';
    this.apiKey = config.apiKey;
    this.apiVersion = import.meta.env.API_VERSION || 'v2';
    this.regionCode = config.regionCode || 'NYC1';
  }

  protected async request<T>(
    responseSchema: z.ZodType<T>,
    resource: Partial<URL | RequestInfo>,
    options?: RequestInit,
  ) {
    // Fix this to only send the region if the request is GET
    const url = new URL(`/${this.apiVersion}${resource}/?region=${this.regionCode}`, this.baseUrl);

    const headers = {
      'Content-Type': 'application/json',
      Connection: 'keep-alive',
      Authorization: `Bearer ${this.apiKey}`,
    };

    const controller = new AbortController();
    const signal = controller.signal;

    const config = {
      ...options,
      headers,
      signal,
    } satisfies RequestInit;

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      if (isErrorResponse(data)) {
        throw new ResponseError(
          `Code: ${data.code} \n Reason: ${data.reason}`,
          response,
        );
      }
      throw new ResponseError('Ooops! something went wrong!', response);
    }

    return responseSchema.parse(data);
  }
}
