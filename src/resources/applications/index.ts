import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { randomName } from '../../utils';
import { Base, NetworksApi } from '..';
import {
  ApplicationConfig,
  ApplicationSchema,
  isApplicationConfig,
  isUpdateApplicationRequest,
  PaginatedApplicationsSchema,
  UpdateApplicationRequest,
} from './types';

export class ApplicationApi extends Base {
  list() {
    return this.request(PaginatedApplicationsSchema, '/applications');
  }

  get(id: string) {
    invariant(id, 'ID is required');

    return this.request(ApplicationSchema, `/applications/${id}`);
  }

  getLogAuth(id: string) {
    invariant(id, 'ID is required');

    return this.request(z.string(), `/applications/${id}/log_auth`);
  }

  async createConfig() {
    const network = new NetworksApi({
      apiKey: this.apiKey,
      regionCode: this.regionCode,
    });
    const defaultNetwork = await network.getDefault();

    return {
      name: randomName(),
      network_id: defaultNetwork.id,
      description: '',
      size: 'small',
      ssh_key_ids: [],
    } satisfies ApplicationConfig;
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

  create(data: ApplicationConfig) {
    if (!isApplicationConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(ApplicationSchema, '/applications', {
      method: 'POST',
      body,
    });
  }

  update(id: string, data: UpdateApplicationRequest) {
    invariant(id, 'ID is required');
    if (!isUpdateApplicationRequest(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(ApplicationSchema, `/applications/${id}`, {
      method: 'PUT',
      body,
    });
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/applications/${id}`);
  }
}
