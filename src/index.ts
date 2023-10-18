import {
  AccountApi,
  ActionApi,
  ApplicationApi,
  ChargeApi,
  Config,
  DatabaseApi,
  DatabaseBackupApi,
  DiskImagesApi,
  DNSDomainApi,
  FirewallApi,
  InstancesApi,
  IPApi,
  KfClusterApi,
  KubernetesApi,
  LoadBalancerApi,
  NetworksApi,
  ObjectStoreApi,
  OrganizationApi,
  PermissionApi,
  PoolApi,
  QuotaApi,
  RegionsApi,
  RoleApi,
  SSHKeyApi,
  SubnetsApi,
  TeamApi,
  UserApi,
  VolumeApi,
  WebhookApi,
} from './resources';

export class Civo {
  accounts: AccountApi;
  actions: ActionApi;
  applications: ApplicationApi;
  charges: ChargeApi;
  databases: DatabaseApi;
  databaseBackups: DatabaseBackupApi;
  diskImages: DiskImagesApi;
  dns: DNSDomainApi;
  firewalls: FirewallApi;
  instances: InstancesApi;
  ips: IPApi;
  kfclusters: KfClusterApi;
  kubernetes: KubernetesApi;
  loadbalancers: LoadBalancerApi;
  networks: NetworksApi;
  subnets: SubnetsApi;
  objectStore: ObjectStoreApi;
  organizations: OrganizationApi;
  permissions: PermissionApi;
  pools: PoolApi;
  quotas: QuotaApi;
  regions: RegionsApi;
  roles: RoleApi;
  sshKeys: SSHKeyApi;
  teams: TeamApi;
  users: UserApi;
  volumes: VolumeApi;
  webhooks: WebhookApi;

  constructor(config: Config) {
    this.accounts = new AccountApi(config);
    this.actions = new ActionApi(config);
    this.applications = new ApplicationApi(config);
    this.charges = new ChargeApi(config);
    this.databases = new DatabaseApi(config);
    this.databaseBackups = new DatabaseBackupApi(config);
    this.diskImages = new DiskImagesApi(config);
    this.dns = new DNSDomainApi(config);
    this.firewalls = new FirewallApi(config);
    this.instances = new InstancesApi(config);
    this.ips = new IPApi(config);
    this.kfclusters = new KfClusterApi(config);
    this.kubernetes = new KubernetesApi(config);
    this.loadbalancers = new LoadBalancerApi(config);
    this.networks = new NetworksApi(config);
    this.subnets = new SubnetsApi(config);
    this.objectStore = new ObjectStoreApi(config);
    this.organizations = new OrganizationApi(config);
    this.permissions = new PermissionApi(config);
    this.pools = new PoolApi(config);
    this.quotas = new QuotaApi(config);
    this.regions = new RegionsApi(config);
    this.roles = new RoleApi(config);
    this.sshKeys = new SSHKeyApi(config);
    this.teams = new TeamApi(config);
    this.users = new UserApi(config);
    this.volumes = new VolumeApi(config);
    this.webhooks = new WebhookApi(config);
  }
}
