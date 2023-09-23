import { Base } from '../base';
import {
  KubernetesClusterConfig,
  KubernetesClusterSchema,
  PaginatedKubernetesClustersSchema,
} from './types';

export class Kubernetes extends Base {
  async listKubernetesClusters() {
    return await this.request(PaginatedKubernetesClustersSchema, {
      route: '/kubernetes/clusters',
      params: undefined,
    });
  }

  async findKubernetesCluster(search: string) {
    search = search.toLowerCase();
    const clusters = await this.listKubernetesClusters();

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

  async newKubernetesClusters(body: KubernetesClusterConfig) {
    body.region = this.regionCode;
    // console.log(body);

    return await this.request(
      KubernetesClusterSchema,
      { route: '/kubernetes/clusters', params: undefined },
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
  }

  async getKubernetesCluster(clusterId: string) {
    return await this.request(KubernetesClusterSchema, {
      route: '/kubernetes/clusters/:clusterId',
      params: { clusterId },
    });
  }

  updateKubernetesCluster() {}

  createKubernetesPool() {}

  listKubernetesMarketplaceApplications() {}

  deleteKubernetesCluster() {}

  recycleKubernetesCluster() {}

  listAvailableKubernetesVersions() {}

  listKubernetesClusterInstances() {}

  findKubernetesClusterInstance() {}
}
