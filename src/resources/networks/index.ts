import { z } from 'zod';

import { Base } from '../base';
import {
  CreateRoute,
  NetworkConfig,
  NetworkResult,
  NetworkResultSchema,
  NetworkSchema,
  SubnetConfig,
  SubnetSchema,
  isCreateRoute,
  isNetworkConfig,
  isSubnetConfig,
} from './types';
import { SimpleResponseSchema } from '../../types';

export class NetworksApi extends Base {
  /**
   * Lists all networks.
   *
   * @returns A promise that resolves to an array of networks.
   */
  async list() {
    return await this.request(z.array(NetworkSchema), '/networks');
  }

  /**
   * Gets the default network.
   *
   * @returns A promise that resolves to the default network.
   */
  async getDefault() {
    const networks = await this.list();
    const defaultNetwork = networks.find((network) => network.default);
    if (!defaultNetwork) {
      throw new Error('Default network not found');
    }
    return defaultNetwork;
  }

  /**
   * Gets the network with the specified ID.
   *
   * @param id The ID of the network.
   *
   * @returns A promise that resolves to the network with the specified ID.
   */
  async get(id: string) {
    if (!id) {
      throw new Error('ID is required');
    }

    const network = await this.request(NetworkSchema, `/networks/${id}`);

    if (network) {
      return network;
    }

    throw new Error('Network not found');
  }

  /**
   * Creates a new network.
   *
   * @param label The label of the network.
   *
   * @returns A promise that resolves to the newly created network.
   */
  async create(label: string): Promise<NetworkResult>;
  async create(body: NetworkConfig): Promise<NetworkResult>;
  async create(data: unknown): Promise<NetworkResult> {
    const body = new FormData();

    if (typeof data === 'string') {
      body.set('label', data);
      body.set('region', this.regionCode);
    } else if (isNetworkConfig(data)) {
      Object.entries(data).forEach(([key, value]) => {
        body.append(key, value as string);
      });
    }

    return await this.request(
      NetworkResultSchema,
      { url: '/networks' },
      {
        method: 'POST',
        body,
      },
    );
  }

  /**
   * Finds a network by the specified search term.
   *
   * @param search The search term.
   *
   * @returns A promise that resolves to the network that matches the search term.
   */
  async find(search: string) {
    search = search.toLowerCase();
    const networks = await this.list();

    const found = networks.find((network) => {
      const id = network.id.toLowerCase();
      const name = network.name?.toLowerCase();
      const label = network.label?.toLowerCase();

      if (
        id.includes(search) ||
        name?.includes(search) ||
        label?.includes(label)
      ) {
        return network;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  /**
   * Renames the network with the specified ID.
   *
   * @param id The ID of the network.
   * @param label The new label of the network.
   *
   * @returns A promise that resolves to the renamed network.
   */
  async rename(id: string, label: string) {
    if (!id) {
      throw new Error('ID is required');
    }

    if (!label) {
      throw new Error('Label is required');
    }

    const body = new FormData();
    body.set('label', label);
    body.set('region', this.regionCode);

    return await this.request(NetworkResultSchema, `/networks/${id}`, {
      method: 'POST',
      body,
    });
  }

  /**
   * Deletes the network with the specified ID.
   *
   * @param id The ID of the network.
   *
   * @returns A promise that resolves when the network has been deleted.
   */
  async destroy(id: string) {
    if (!id) {
      throw new Error('ID is required');
    }

    const searchParams = new URLSearchParams({ region: this.regionCode });
    await this.request(
      z.object({ result: z.literal('success') }),
      {
        url: `/networks/${id}`,
        searchParams,
      },
      { method: 'DELETE' },
    );
  }

  /**
   * Updates the network with the specified ID.
   *
   * @param id The ID of the network.
   * @param data The new data for the network.
   *
   * @returns A promise that resolves to the updated network.
   */
  update(id: string, data: NetworkConfig) {
    if (!id) {
      throw new Error('ID is required');
    }

    if (!isNetworkConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      body.append(key, value as string);
    });

    return this.request(NetworkResultSchema, `/networks/${id}`, {
      method: 'POST',
      body,
    });
  }
}

export class SubnetsApi extends Base {
  /**
   * Lists all subnets in a network.
   *
   * @param networkId The ID of the network.
   * @returns A promise for an array of subnets.
   */
  list(networkId: string) {
    if (!networkId) {
      throw new Error('Network ID is required');
    }
    return this.request(SubnetSchema.array(), `/networks/${networkId}/subnets`);
  }

  /**
   * Gets a subnet by its ID.
   *
   * @param networkId The ID of the network.
   * @param subnetId The ID of the subnet.
   * @returns A promise for a subnet.
   */
  get(networkId: string, subnetId: string) {
    if (!networkId) {
      throw new Error('Network ID is required');
    }

    if (!subnetId) {
      throw new Error('Subnet ID is required');
    }

    return this.request(
      SubnetSchema,
      `/networks/${networkId}/subnets/${subnetId}`,
    );
  }

  /**
   * Creates a new subnet in a network.
   *
   * @param networkId The ID of the network.
   * @param subnet The subnet configuration.
   * @returns A promise for the new subnet.
   */
  create(networkId: string, subnet: SubnetConfig) {
    if (!networkId) {
      throw new Error('Network ID is required');
    }

    if (!isSubnetConfig(subnet)) {
      throw new Error('Invalid data');
    }

    const body = new FormData();

    Object.entries(subnet).forEach(([key, value]) => {
      body.append(key, value as string);
    });

    return this.request(SubnetSchema, `/networks/${networkId}/subnets`, {
      method: 'POST',
      body,
    });
  }

  /**
   * Finds a subnet by its name or ID.
   *
   * @param networkId The ID of the network.
   * @param search The name or ID of the subnet to search for.
   * @returns A promise for the subnet, or `undefined` if no subnet is found.
   */
  async find(networkId: string, search: string) {
    search = search.toLowerCase();
    const subnets = await this.list(networkId);

    const found = subnets.find((subnet) => {
      const id = subnet.id.toLowerCase();
      const name = subnet.name?.toLowerCase();

      if (id.includes(search) || name?.includes(search)) {
        return subnet;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  /**
   * Attaches a subnet to an instance.
   *
   * @param networkId The ID of the network.
   * @param subnetId The ID of the subnet.
   * @param route The route configuration.
   * @returns A promise for the new route.
   */
  attachToInstance(networkId: string, subnetId: string, route: CreateRoute) {
    if (!networkId) {
      throw new Error('Network ID is required');
    }

    if (!subnetId) {
      throw new Error('Subnet ID is required');
    }

    if (!isCreateRoute(route)) {
      throw new Error('Invalid data');
    }

    const body = new FormData();

    Object.entries(route).forEach(([key, value]) => {
      body.append(key, value as string);
    });

    return this.request(
      SubnetSchema,
      `/networks/${networkId}/subnets/${subnetId}/routes`,
      {
        method: 'POST',
        body,
      },
    );
  }

  /**
   * Detaches a subnet from an instance.
   *
   * @param networkId The ID of the network.
   * @param subnetId The ID of the subnet.
   * @returns A promise for the response.
   */
  detachFromInstance(networkId: string, subnetId: string) {
    if (!networkId) {
      throw new Error('Network ID is required');
    }

    if (!subnetId) {
      throw new Error('Subnet ID is required');
    }

    return this.request(
      SimpleResponseSchema,
      `/networks/${networkId}/subnets/${subnetId}/routes`,
      { method: 'DELETE' },
    );
  }

  /**
   * Deletes a subnet.
   *
   * @param networkId The ID of the network.
   * @param subnetId The ID of the subnet.
   * @returns A promise for the response.
   */
  destroy(networkId: string, subnetId: string) {
    if (!networkId) {
      throw new Error('Network ID is required');
    }

    if (!subnetId) {
      throw new Error('Subnet ID is required');
    }

    return this.request(
      SimpleResponseSchema,
      `/networks/${networkId}/subnets/${subnetId}/routes`,
      { method: 'DELETE' },
    );
  }
}
