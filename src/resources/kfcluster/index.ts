import invariant from 'tiny-invariant';

import { SimpleResponseSchema } from '../../types';
import { Base } from '../base';;
import {
  CreateKfClusterReq,
  isCreateKfClusterReq,
  isUpdateKfClusterReq,
  KfClusterSchema,
  PaginatedKfClustersSchema,
  UpdateKfClusterReq,
} from './types';

export class KfClusterApi extends Base {
  list() {
    return this.request(PaginatedKfClustersSchema, '/kfclusters');
  }

  get(id: string) {
    invariant(id, 'ID is required');

    return this.request(KfClusterSchema, `/kfclusters/${id}`);
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

  create(data: CreateKfClusterReq) {
    if (!isCreateKfClusterReq(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify({ region: this.regionCode, ...data });

    return this.request(KfClusterSchema, '/kfclusters', {
      method: 'POST',
      body,
    });
  }

  update(id: string, data: UpdateKfClusterReq) {
    invariant(id, 'ID is required');
    if (!isUpdateKfClusterReq(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify({ region: this.regionCode, ...data });

    return this.request(KfClusterSchema, `/kfclusters/${id}`, {
      method: 'PUT',
      body,
    });
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/kfclusters/${id}`, {
      method: 'DELETE',
    });
  }
}
