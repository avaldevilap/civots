import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { Base } from '../base';
import { InstanceSchema } from '../instances/types';
import {
  isKubernetesClusterConfig,
  isKubernetesClusterPoolConfig,
  type KubernetesClusterConfig,
  KubernetesClusterPoolConfig,
  KubernetesClusterSchema,
  KubernetesMarketplaceApplicationSchema,
  KubernetesVersionSchema,
  PaginatedKubernetesClustersSchema,
} from './types';

export class Kubernetes extends Base {
  /**
   * Lists all Kubernetes clusters.
   *
   * @returns A paginated list of Kubernetes clusters.
   */
  listClusters() {
    return this.request(
      PaginatedKubernetesClustersSchema,
      '/kubernetes/clusters',
    );
  }

  /**
   * Finds a Kubernetes cluster by search term.
   *
   * @param search The search term.
   * @returns The Kubernetes cluster, or undefined if not found.
   */
  async findKubernetesCluster(search: string) {
    search = search.toLowerCase();
    const clusters = await this.listClusters();

    const found = clusters.items.find((cluster) => {
      const id = cluster.id.toLowerCase();
      const name = cluster.name?.toLowerCase();

      if (id.search(search) || name?.search(search)) {
        return cluster;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  /**
   * Creates a new Kubernetes cluster.
   *
   * @param data The Kubernetes cluster configuration.
   * @returns The newly created Kubernetes cluster.
   */
  createCluster(data: KubernetesClusterConfig) {
    if (!isKubernetesClusterConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      body.append(key, value as string);
    });
    body.set('region', this.regionCode);

    return this.request(KubernetesClusterSchema, '/kubernetes/clusters', {
      method: 'POST',
      body,
    });
  }

  /**
   * Gets the details of a Kubernetes cluster.
   *
   * @param id The ID of the Kubernetes cluster.
   * @returns The Kubernetes cluster.
   */
  getCluster(id: string) {
    invariant(id, 'ID is required');

    return this.request(KubernetesClusterSchema, `/kubernetes/clusters/${id}`);
  }

  /**
   * Updates a Kubernetes cluster.
   *
   * @param id The ID of the Kubernetes cluster.
   * @param data The Kubernetes cluster configuration.
   * @returns The updated Kubernetes cluster.
   */
  updateCluster(id: string, data: KubernetesClusterConfig) {
    invariant(id, 'ID is required');

    if (!isKubernetesClusterConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      body.append(key, value as string);
    });
    body.set('region', this.regionCode);

    return this.request(KubernetesClusterSchema, `/kubernetes/clusters/${id}`, {
      method: 'PUT',
      body,
    });
  }

  /**
   * Creates a new Kubernetes cluster pool.
   *
   * @param id The ID of the Kubernetes cluster.
   * @param data The Kubernetes cluster pool configuration.
   * @returns The newly created Kubernetes cluster pool.
   */
  createPool(id: string, data: KubernetesClusterPoolConfig) {
    invariant(id, 'ID is required');

    if (!isKubernetesClusterPoolConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      body.append(key, value as string);
    });
    body.set('region', this.regionCode);

    return this.request(
      KubernetesClusterSchema,
      `/kubernetes/clusters/${id}/pools`,
      {
        method: 'POST',
        body,
      },
    );
  }

  /**
   * Lists all Kubernetes Marketplace applications.
   *
   * @returns A paginated list of Kubernetes Marketplace applications.
   */
  listMarketplaceApplications() {
    return this.request(
      KubernetesMarketplaceApplicationSchema,
      '/kubernetes/applications',
    );
  }

  /**
   * Destroys a Kubernetes cluster.
   *
   * @param id The ID of the Kubernetes cluster.
   * @returns A promise that resolves when the Kubernetes cluster has been destroyed.
   */
  destroyCluster(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/kubernetes/clusters/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Recycles a Kubernetes cluster. This will restart all of the cluster's nodes,
   * which can be useful for troubleshooting or fixing problems with the cluster.
   *
   * @param id The ID of the Kubernetes cluster.
   * @param hostname The hostname of the Kubernetes cluster.
   * @returns A promise that resolves when the Kubernetes cluster has been recycled.
   */
  recycleCluster(id: string, hostname: string) {
    invariant(id, 'ID is required');
    invariant(hostname, 'Hostname is required');

    const body = new FormData();
    body.set('hostname', hostname);
    body.set('region', this.regionCode);

    return this.request(
      SimpleResponseSchema,
      `/kubernetes/clusters/${id}/recycle`,
      { method: 'POST', body },
    );
  }

  /**
   * Lists all available Kubernetes versions.
   *
   * @returns A promise that resolves to an array of Kubernetes versions.
   */
  listAvailableVersions() {
    return this.request(
      KubernetesVersionSchema.array(),
      '/kubernetes/versions',
    );
  }

  /**
   * Lists all of the instances in a Kubernetes cluster.
   *
   * @param id The ID of the Kubernetes cluster.
   * @returns A promise that resolves to an array of Kubernetes cluster instances.
   */
  listClusterInstances(id: string) {
    invariant(id, 'ID is required');

    return this.request(
      z.array(InstanceSchema),
      `/kubernetes/clusters/${id}/instances`,
    );
  }

  /**
   * Finds a Kubernetes cluster instance by ID and search term.
   *
   * @param id The ID of the Kubernetes cluster.
   * @param search The search term.
   * @returns A promise that resolves to the Kubernetes cluster instance, or undefined if not found.
   */
  async findClusterInstance(id: string, search: string) {
    invariant(id, 'ID is required');

    search = search.toLowerCase();
    const instances = await this.listClusterInstances(id);

    const found = instances.find((instance) => {
      const id = instance.id.toLowerCase();
      const hostname = instance.hostname?.toLowerCase();

      if (id.includes(search) || hostname?.includes(search)) {
        return instance;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }
}
