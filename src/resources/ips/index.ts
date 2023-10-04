import invariant from 'tiny-invariant';

import { Base } from '..';
import {
  Actions,
  CreateIPRequest,
  IPSchema,
  PaginatedIPsSchema,
  UpdateIPRequest,
  isCreateIPRequest,
  isUpdateIPRequest,
} from './types';
import { SimpleResponseSchema } from '../../types';

export class IPApi extends Base {
  list() {
    return this.request(PaginatedIPsSchema, '/ips');
  }

  get(id: string) {
    invariant(id, 'ID is required');

    return this.request(IPSchema, `/ips/${id}`);
  }

  async find(search: string) {
    search = search.toLowerCase();
    const { items } = await this.list();

    const found = items.find((item) => {
      const id = item.id.toLowerCase();
      const name = item.name?.toLowerCase();
      const ip = item.ip?.toLowerCase();

      if (id.search(search) || name?.search(search) || ip?.search(search)) {
        return item;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  create(data: CreateIPRequest) {
    if (!isCreateIPRequest(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(IPSchema, '/ips', { method: 'POST', body });
  }

  update(id: string, data: UpdateIPRequest) {
    invariant(id, 'ID is required');

    if (!isUpdateIPRequest(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(IPSchema, `/ips/${id}`, { method: 'PUT', body });
  }

  assign(
    id: string,
    resourceId: string,
    resourceType: string,
    region?: string,
  ) {
    invariant(id, 'ID is required');
    invariant(resourceId, 'Resource id is required');
    invariant(resourceType, 'Resource type is required');
    invariant(region, 'Region is required');

    const body = JSON.stringify({
      action: 'assign',
      region: region ?? this.regionCode,
      assign_to_id: resourceId,
      assign_to_type: resourceType,
    } satisfies Actions);

    return this.request(SimpleResponseSchema, `/ips/${id}/actions`, {
      method: 'POST',
      body,
    });
  }

  unassign(id: string, region?: string) {
    invariant(id, 'ID is required');

    const body = JSON.stringify({
      action: 'unassign',
      region: region ?? this.regionCode,
    } satisfies Actions);

    return this.request(SimpleResponseSchema, `/ips/${id}/actions`, {
      method: 'POST',
      body,
    });
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/ips/${id}`, {
      method: 'DELETE',
    });
  }
}
