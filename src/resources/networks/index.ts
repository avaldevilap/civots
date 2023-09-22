import { z } from 'zod';

import { Base } from '../base';
import {
  NetworkConfig,
  NetworkResult,
  NetworkResultSchema,
  NetworkSchema,
} from './types';
import { NetworkID } from '../../types';

export class Networks extends Base {
  async getDefaultNetwork() {
    const networks = await this.listNetworks();
    const found = networks.find((network) => network.default);
    if (found) {
      return found;
    }
    throw new Error('Default network not found');
  }

  async getNetwork(networkId: NetworkID) {
    const network = await this.request(NetworkSchema, {
      route: '/networks/:networkId',
      params: { networkId },
    });
    if (network) {
      return network;
    }
    throw new Error('Network not found');
  }

  async newNetwork(label: string): Promise<NetworkResult>;
  async newNetwork(body: NetworkConfig): Promise<NetworkResult>;
  async newNetwork(data: unknown): Promise<NetworkResult> {
    let body;

    if (typeof data === 'string') {
      body = JSON.stringify({ label: data, region: this.regionCode });
    } else {
      body = JSON.stringify(data);
    }

    return await this.request(
      NetworkResultSchema,
      { route: '/networks', params: undefined },
      {
        method: 'POST',
        body,
      },
    );
  }

  async listNetworks() {
    return await this.request(z.array(NetworkSchema), {
      route: '/networks',
      params: undefined,
    });
  }

  async findNetwork(search: string) {
    search = search.toLowerCase();
    const networks = await this.listNetworks();

    const found = networks.find((network) => {
      const id = network.id.toLowerCase();
      const name = network.name?.toLowerCase();
      const label = network.label?.toLowerCase();

      if (id.search(search) || name?.search(search) || label?.search(label)) {
        return network;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  renameNetwork() {}

  async deleteNetwork(networkId: NetworkID) {
    await this.request(
      z.object({ result: z.literal('success') }),
      {
        route: '/networks/:networkId',
        params: { networkId: `${networkId}?region=${this.regionCode}` },
      },
      { method: 'DELETE' },
    );
  }

  getSubnet() {}

  listSubnets() {}

  createSubnet() {}

  findSubnet() {}

  attachSubnetToInstance() {}

  detachSubnetFromInstance() {}

  deleteSubnet() {}

  updateNetwork() {}
}
