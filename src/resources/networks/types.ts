import { z } from 'zod';

import { NoArgs, NetworkID, SubnetID } from '../../types';

export type Routes = {
  '/networks': NoArgs;
  '/networks/:networkId': { networkId: NetworkID };
  '/networks/:networkId/subnets': NetworkID;
  '/networks/:networkId/subnets/:subnetId': {
    networkId: NetworkID;
    subnetId: SubnetID;
  };
  '/networks/:networkId/subnets/:subnetId/routes': {
    networkId: NetworkID;
    subnetId: SubnetID;
  };
};

export type Network = z.infer<typeof NetworkSchema>;
export type Subnet = z.infer<typeof SubnetSchema>;
export type SubnetConfig = z.infer<typeof SubnetConfigSchema>;
export type Route = z.infer<typeof RouteSchema>;
export type CreateRoute = z.infer<typeof CreateRouteSchema>;
export type NetworkConfig = z.infer<typeof NetworkConfigSchema>;
export type NetworkResult = z.infer<typeof NetworkResultSchema>;

// Network represents a private network for instances to connect to
export const NetworkSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  default: z.boolean(),
  cidr: z.string().optional(),
  cidr_v6: z.string().optional(),
  label: z.string().optional(),
  status: z.string().optional(),
  ipv4_enabled: z.boolean().optional(),
  ipv6_enabled: z.boolean().optional(),
  nameservers_v4: z.array(z.string()).optional(),
  nameservers_v6: z.array(z.string()).optional(),
});

// Subnet represents a subnet within a private network
export const SubnetSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  network_id: z.string(),
  subnet_size: z.string().optional(),
  status: z.string().optional(),
});

// SubnetConfig contains incoming request parameters for the subnet object
export const SubnetConfigSchema = z.object({
  name: z.string(),
});

// Route represents a route within a subnet
export const RouteSchema = z.object({
  id: z.string(),
  subnet_id: z.string(),
  network_id: z.string(),
  resource_id: z.string(),
  resource_type: z.string(),
});

// CreateRoute contains incoming request parameters for creating a route object
export const CreateRouteSchema = z.object({
  resource_id: z.string(),
  resource_type: z.string(),
});

// NetworkConfig contains incoming request parameters for the network object
export const NetworkConfigSchema = z.object({
  label: z.string(),
  default: z.string().optional(),
  ipv4_enabled: z.boolean().optional(),
  nameservers_v4: z.array(z.string()).optional(),
  cidr_v4: z.string().optional(),
  ipv6_enabled: z.boolean().optional(),
  nameservers_v6: z.array(z.string()).optional(),
  region: z.string(),
});

// NetworkResult represents the result from a network create/update call
export const NetworkResultSchema = z.object({
  id: z.string(),
  label: z.string(),
  result: z.string(),
});
