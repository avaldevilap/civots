import { InstanceId, NoArgs } from '../../types';
import { Subnet } from '../networks/types';

export declare interface Routes {
  '/instances': NoArgs;
  '/instances/:instanceId': InstanceId;
  '/instances/:instanceId/tags': InstanceId;
  '/instances/:instanceId/reboots': InstanceId;
  '/instances/:instanceId/hard_reboots': InstanceId;
  '/instances/:instanceId/soft_reboots': InstanceId;
  '/instances/:instanceId/start': InstanceId;
  '/instances/:instanceId/stop': InstanceId;
  '/instances/:instanceId/resize': InstanceId;
  '/instances/:instanceId/firewall': InstanceId;
}

export type Instance = {
  id: string;
  openstack_server_id: string;
  hostname: string;
  reverse_dns: string;
  size: string;
  region: string;
  network_id: string;
  private_ip: string;
  public_ip: string;
  ipv6: string;
  pseudo_ip: string;
  template_id: string;
  source_type: string;
  source_id: string;
  snapshot_id: string;
  initial_user: string;
  initial_password: string;
  ssh_key: string;
  ssh_key_id: string;
  status: string;
  notes: string;
  firewall_id: string;
  tags: string[];
  civostatsd_token: string;
  civostatsd_stats: string;
  civostatsd_stats_per_minute: string[];
  civostatsd_stats_per_hour: string[];
  openstack_image_id: string;
  rescue_password: string;
  volume_backed: boolean;
  cpu_cores: number;
  ram_mb: number;
  disk_gb: number;
  gpu_count: number;
  gpu_type: string;
  script: string;
  created_at: string;
  reserved_ip_id: string;
  reserved_ip_name: string;
  reserved_ip: string;
  subnets: Subnet[];
};
