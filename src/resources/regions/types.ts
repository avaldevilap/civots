import { NoArgs } from "../../types";

export declare type Routes = {
  regions: NoArgs;
};

export declare type Region = {
  code: string;
  name: string;
  type: string;
  out_of_capacity: boolean;
  country: string;
  country_name: string;
  features: Feature;
  default: boolean;
};

export declare type Feature = {
  iaas: boolean;
  kubernetes: boolean;
  object_store: boolean;
  loadbalancer: boolean;
  dbaas: boolean;
  volume: boolean;
  paas: boolean;
  kfaas: boolean;
  public_ip_node_pools: boolean;
};
