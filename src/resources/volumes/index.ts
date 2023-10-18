import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { Base, KubernetesApi } from '..';
import {
  isVolumeConfig,
  VolumeConfig,
  VolumeResultSchema,
  VolumeSchema,
} from './types';

export class VolumeApi extends Base {
  list() {
    return this.request(z.array(VolumeSchema), '/volumes');
  }

  async listClusterVolumes(clusterId: string) {
    invariant(clusterId, 'Cluster id is required');
    const kubernetes = new KubernetesApi({
      apiKey: this.apiKey,
      regionCode: this.regionCode,
    });
    const cluster = await kubernetes.findKubernetesCluster(clusterId);

    const volumes = await this.list();

    const clusterVolumes = volumes.filter(
      ({ cluster_id }) => cluster_id === cluster.id,
    );

    return clusterVolumes;
  }

  async listDanglingVolumes() {
    const kubernetes = new KubernetesApi({
      apiKey: this.apiKey,
      regionCode: this.regionCode,
    });

    const volumes = await this.list();
    const clusters = await kubernetes.listClusters();
    const clustersIds = clusters.items.map(({ id }) => id);

    return volumes.filter(({ cluster_id }) => clustersIds.includes(cluster_id));
  }

  get(id: string) {
    invariant(id, 'ID is required');

    return this.request(VolumeSchema, `/volumes/${id}`);
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

  create(data: VolumeConfig) {
    if (!isVolumeConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(VolumeResultSchema, '/volumes', {
      method: 'POST',
      body,
    });
  }

  resize(id: string, size: number) {
    invariant(id, 'ID is required');
    invariant(size, 'Size is required');

    const body = JSON.stringify({ size_gb: size, region: this.regionCode });

    return this.request(SimpleResponseSchema, `/volumes/${id}/resize`, {
      method: 'PUT',
      body,
    });
  }

  attach(id: string, instance_id: string) {
    invariant(id, 'ID is required');
    invariant(instance_id, 'Instance id is required');

    const body = JSON.stringify({ instance_id, region: this.regionCode });

    return this.request(SimpleResponseSchema, `/volumes/${id}/attach`, {
      method: 'PUT',
      body,
    });
  }

  detach(id: string) {
    invariant(id, 'ID is required');

    const body = JSON.stringify({ region: this.regionCode });

    return this.request(SimpleResponseSchema, `/volumes/${id}/detach`, {
      method: 'PUT',
      body,
    });
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/volumes/${id}`, {
      method: 'DELETE',
    });
  }
}
