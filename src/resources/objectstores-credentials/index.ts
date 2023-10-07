import invariant from 'tiny-invariant';

import { SimpleResponseSchema } from '../../types';
import { Base } from '..';
import {
  CreateObjectStoreCredentialRequest,
  isCreateObjectStoreCredentialRequest,
  isUpdateObjectStoreCredentialRequest,
  ObjectStoreCredentialSchema,
  PaginatedObjectStoreCredentialsSchema,
  UpdateObjectStoreCredentialRequest,
} from './types';

export class ObjectStoreCredentials extends Base {
  list() {
    return this.request(
      PaginatedObjectStoreCredentialsSchema,
      '/objectstore/credentials',
    );
  }

  get(id: string) {
    invariant(id, 'ID is required');

    return this.request(
      ObjectStoreCredentialSchema,
      `/objectstore/credentials/${id}`,
    );
  }

  async find(search: string) {
    search = search.toLowerCase();
    const { items } = await this.list();

    const found = items.find((item) => {
      const id = item.id.toLowerCase();
      const name = item.name?.toLowerCase();
      const accessKeyId = item.access_key_id?.toLowerCase();

      if (
        id.search(search) ||
        name?.search(search) ||
        accessKeyId.search(search)
      ) {
        return item;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  create(data: CreateObjectStoreCredentialRequest) {
    if (!isCreateObjectStoreCredentialRequest(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(
      ObjectStoreCredentialSchema,
      '/objectstore/credentials',
      { method: 'POST', body },
    );
  }

  update(id: string, data: UpdateObjectStoreCredentialRequest) {
    invariant(id, 'ID is required');
    if (!isUpdateObjectStoreCredentialRequest(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(
      ObjectStoreCredentialSchema,
      `/objectstore/credentials/${id}`,
      { method: 'PUT', body },
    );
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(
      SimpleResponseSchema,
      `/objectstore/credentials/${id}`,
      { method: 'DELETE' },
    );
  }
}
