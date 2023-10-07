import invariant from 'tiny-invariant';

import { SimpleResponseSchema } from '../../types';
import { Base } from '..';
import {
  CreateObjectStoreRequest,
  isCreateObjectStoreRequestSchema,
  isUpdateObjectStoreRequestSchema,
  ObjectStoreSchema,
  PaginatedObjectStoresSchema,
  UpdateObjectStoreRequest,
} from './types';

export class ObjectStoreApi extends Base {
  list() {
    return this.request(PaginatedObjectStoresSchema, '/objectstores');
  }

  get(id: string) {
    invariant(id, 'ID is required');

    return this.request(ObjectStoreSchema, `/objectstores/${id}`);
  }

  async find(search: string) {
    search = search.toLowerCase();
    const { items } = await this.list();

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

  create(data: CreateObjectStoreRequest) {
    if (!isCreateObjectStoreRequestSchema(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(ObjectStoreSchema, '/objectstores', {
      method: 'POST',
      body,
    });
  }

  update(id: string, data: UpdateObjectStoreRequest) {
    invariant(id, 'ID is required');
    if (!isUpdateObjectStoreRequestSchema(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(ObjectStoreSchema, `/objectstores/${id}`, {
      method: 'PUT',
      body,
    });
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/objectstores/${id}`, {
      method: 'DELETE',
    });
  }
}
