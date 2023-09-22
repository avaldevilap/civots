import { Config } from './resources/base';
import { Instances } from './resources/instances';
import { Kubernetes } from './resources/kubernetes';
import { Networks } from './resources/networks';
import { Regions } from './resources/regions';

export class Civo {
  regions: Regions;
  networks: Networks;
  kubernetes: Kubernetes;
  instances: Instances;

  constructor(config: Config) {
    this.regions = new Regions(config);
    this.networks = new Networks(config);
    this.kubernetes = new Kubernetes(config);
    this.instances = new Instances(config);
  }
}
