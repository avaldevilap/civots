import {
  Config,
  InstancesApi,
  KubernetesApi,
  NetworksApi,
  RegionsApi,
  SubnetsApi,
} from './resources';

export class Civo {
  regions: RegionsApi;
  networks: NetworksApi;
  subnets: SubnetsApi;
  kubernetes: KubernetesApi;
  instances: InstancesApi;

  constructor(config: Config) {
    this.regions = new RegionsApi(config);
    this.networks = new NetworksApi(config);
    this.subnets = new SubnetsApi(config);
    this.kubernetes = new KubernetesApi(config);
    this.instances = new InstancesApi(config);
  }
}
