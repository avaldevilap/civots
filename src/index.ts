import { Config } from "./resources/base";
import { Regions } from "./resources/regions";

export class Civo {
  regions: Regions;

  constructor(config: Config) {
    this.regions = new Regions(config);
  }
}
