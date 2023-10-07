import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { Base } from '..';
import {
  isLoadBalancerConfig,
  isLoadBalancerUpdateConfig,
  type LoadBalancerConfig,
  LoadBalancerSchema,
  LoadBalancerUpdateConfig,
} from './types';

export class LoadBalancerApi extends Base {
  list() {
    return this.request(z.array(LoadBalancerSchema), '/loadbalancers');
  }

  get(id: string) {
    invariant(id, 'ID is required');

    return this.request(LoadBalancerSchema, `/loadbalancers/${id}`);
  }

  async find(search: string) {
    search = search.toLowerCase();
    const items = await this.list();

    const found = items.find((item) => {
      const id = item.id.toLowerCase();
      const name = item.name?.toLowerCase();

      if (id.search(search) || name?.search(search)) {
        return item;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  create(data: LoadBalancerConfig) {
    if (!isLoadBalancerConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(LoadBalancerSchema, '/loadbalancers', {
      method: 'POST',
      body,
    });
  }

  update(id: string, data: LoadBalancerUpdateConfig) {
    invariant(id, 'ID is required');
    if (!isLoadBalancerUpdateConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(LoadBalancerSchema, `/loadbalancers/${id}`, {
      method: 'PUT',
      body,
    });
  }

  delete(id: string) {
    return this.request(SimpleResponseSchema, `/loadbalancers/${id}`, {
      method: 'DELETE',
    });
  }
}
