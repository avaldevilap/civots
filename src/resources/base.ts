import { z } from 'zod';

import type { Routes as InstancesRoutes } from './instances/types';
import type { Routes as RegionsRoutes } from './regions/types';
import type { Routes as KubernetesRoutes } from './kubernetes/types';
import type { Routes as NetworksRoutes } from './networks/types';
import { ResponseError, isErrorResponse } from '../errors';

type RegionCode = string;

export type AllRoutes = InstancesRoutes &
  RegionsRoutes &
  KubernetesRoutes &
  NetworksRoutes;

type RouteArgs<T extends keyof AllRoutes> = {
  route: T;
  params: AllRoutes[T];
};

export type Config = {
  apiKey: string;
  regionCode?: RegionCode;
};

export abstract class Base {
  private baseUrl: string;
  private apiKey: string;
  private apiVersion: string;
  protected regionCode: RegionCode;

  constructor(config: Config) {
    this.baseUrl = import.meta.env.API_URL || 'https://api.civo.com';
    this.apiKey = config.apiKey;
    this.apiVersion = import.meta.env.API_VERSION || 'v2';
    this.regionCode = config.regionCode || 'LON1';
  }

  private includesParams(route: string) {
    return route.indexOf('/:') > -1;
  }

  protected async request<
    ExpectedResult extends z.ZodTypeAny,
    Route extends keyof AllRoutes,
  >(
    schema: ExpectedResult,
    args: RouteArgs<Route>,
    options?: RequestInit,
  ): Promise<z.infer<typeof schema>> {
    let path = args.route;

    if (this.includesParams(args.route)) {
      path = args.route
        .split('/')
        .map((fragment) => {
          if (fragment.indexOf(':') > -1) {
            let paramName = fragment.slice(1);
            if (paramName.indexOf('?') > -1) {
              paramName = paramName.slice(0, -1);
            }
            if (paramName in args.params) {
              return args.params[paramName];
            }
            return null;
          }
          return fragment;
        })
        .filter((f) => f !== null)
        .join('/') as Route;
    }

    const url = new URL(`/${this.apiVersion}${path}`, this.baseUrl);

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    const controller = new AbortController();
    const signal = controller.signal;

    const config = {
      ...options,
      headers,
      signal,
    } satisfies RequestInit;

    if (config.method === 'GET' || config.method === undefined) {
      url.searchParams.set('region', this.regionCode);
    }

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

    return schema.parse(data);
  }
}
