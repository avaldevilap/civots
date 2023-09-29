import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { randomName } from '../../utils';
import { Base } from '../base';
import { DiskImageSchema } from '../disk-image/types';
import { NetworkSchema } from '../networks/types';
import {
  Instance,
  InstanceConfig,
  InstanceSchema,
  isInstanceConfig,
  PaginatedInstanceListSchema,
} from './types';

export class InstancesApi extends Base {
  list(page: number = 1, perPage: number = 15) {
    const searchParams = new URLSearchParams();
    searchParams.set('page', String(page));
    searchParams.set('per_page', String(perPage));

    return this.request(PaginatedInstanceListSchema, {
      url: '/instances',
      searchParams,
    });
  }

  async find(search: string) {
    search = search.toLowerCase();
    const instances = await this.list();

    const found = instances.items.find((instance) => {
      const id = instance.id.toLowerCase();
      const hostname = instance.hostname?.toLowerCase();

      if (id.search(search) || hostname?.search(search)) {
        return instance;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  get(id: string) {
    invariant(id, 'ID is required');

    return this.request(InstanceSchema, `/instances/${id}`);
  }

  async createConfig(): Promise<InstanceConfig> {
    const networks = await this.request(z.array(NetworkSchema), '/networks');
    const defaultNetwork = networks.find((network) => network.default);
    if (!defaultNetwork) throw new Error('Network not found');

    const diskImages = await this.request(
      z.array(DiskImageSchema),
      '/disk_images',
    );
    const filteredDiskImages = diskImages.filter(
      ({ name }) => !name?.search('k3s'),
    );
    const diskImage = filteredDiskImages.find(
      ({ name }) => name === 'ubuntu-focal',
    );
    if (!diskImage) throw new Error('Disk image not found');

    return {
      count: 1,
      hostname: randomName(),
      reverse_dns: '',
      size: 'g3.medium',
      region: this.regionCode,
      public_ip: 'true',
      network_id: defaultNetwork.id,
      template_id: diskImage.id,
      snapshot_id: '',
      initial_user: 'civo',
      ssh_key_id: '',
      script: '',
      tags: [],
      firewall_id: '',
    };
  }

  create(data: InstanceConfig) {
    if (!isInstanceConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      body.append(key, value as string);
    });

    return this.request(InstanceSchema, '/instances', {
      method: 'POST',
      body,
    });
  }

  setTags(instance: Instance, tags: string) {
    const body = new FormData();
    body.set('tags', tags);
    body.set('region', this.regionCode);

    return this.request(
      SimpleResponseSchema,
      `/instances/${instance.id}/tags`,
      { method: 'PUT', body },
    );
  }

  update(instance: Instance) {
    const body = {
      hostname: instance.hostname,
      reverse_dns: instance.reverse_dns,
      notes: instance.notes,
      region: this.regionCode,
      public_ip: instance.public_ip,
      subnets: instance.subnets,
    };

    if (!instance.notes) {
      // @ts-expect-error extra key
      body.notes_delete = 'true';
    }

    return this.request(SimpleResponseSchema, `/instances/${instance.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/instances/${id}`, {
      method: 'DELETE',
    });
  }

  hardReboot(id: string) {
    invariant(id, 'ID is required');

    const body = new FormData();
    body.set('region', this.regionCode);

    return this.request(SimpleResponseSchema, `/instances/${id}/hard_reboots`, {
      method: 'POST',
      body,
    });
  }

  softReboot(id: string) {
    invariant(id, 'ID is required');

    const body = new FormData();
    body.set('region', this.regionCode);

    return this.request(SimpleResponseSchema, `/instances/${id}/soft_reboots`, {
      method: 'POST',
      body,
    });
  }

  stop(id: string) {
    invariant(id, 'ID is required');

    const body = new FormData();
    body.set('region', this.regionCode);

    return this.request(SimpleResponseSchema, `/instances/${id}/stop`, {
      method: 'PUT',
      body,
    });
  }

  start(id: string) {
    invariant(id, 'ID is required');

    const body = new FormData();
    body.set('region', this.regionCode);

    return this.request(SimpleResponseSchema, `/instances/${id}/start`, {
      method: 'PUT',
      body,
    });
  }

  getConsoleURL(id: string) {
    invariant(id, 'ID is required');

    return this.request(z.string(), `/instances/${id}/console`);
  }

  upgrade(id: string, newSize: string) {
    invariant(id, 'ID is required');
    invariant(newSize, 'New size is required');

    const body = new FormData();
    body.set('size', newSize);
    body.set('region', this.regionCode);

    return this.request(SimpleResponseSchema, `/instances/${id}/resize`, {
      method: 'PUT',
    });
  }

  movePublicIPToInstance(id: string, ipAddress: string) {
    z.string().parse(id);
    z.string().ip().parse(ipAddress);

    return this.request(
      SimpleResponseSchema,
      `/instances/${id}/ip/${ipAddress}`,
      { method: 'PUT' },
    );
  }

  setInstanceFirewall(id: string, firewallId: string) {
    z.string().parse(id);
    z.string().ip().parse(firewallId);

    const body = new FormData();
    body.set('firewall_id', firewallId);
    body.set('region', this.regionCode);

    return this.request(
      SimpleResponseSchema,
      `/instances/${id}/ip/${firewallId}`,
      { method: 'PUT', body },
    );
  }
}
