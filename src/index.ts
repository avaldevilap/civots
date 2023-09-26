import { Config, NetworksApi, RegionsApi, SubnetsApi } from './resources';
import { Instances } from './resources/instances';
import { Kubernetes } from './resources/kubernetes';

export class Civo {
  regions: RegionsApi;
  networks: NetworksApi;
  subnets: SubnetsApi;
  kubernetes: Kubernetes;
  instances: Instances;

  constructor(config: Config) {
    this.regions = new RegionsApi(config);
    this.networks = new NetworksApi(config);
    this.subnets = new SubnetsApi(config);
    this.kubernetes = new Kubernetes(config);
    this.instances = new Instances(config);
  }
}
