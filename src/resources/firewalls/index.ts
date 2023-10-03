import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { Base } from '..';
import {
  FirewallConfig,
  FirewallResultSchema,
  FirewallRuleConfig,
  FirewallRuleSchema,
  FirewallSchema,
  isFirewallConfig,
  isFirewallRuleConfig,
} from './types';

export class FirewallApi extends Base {
  list() {
    return this.request(z.array(FirewallSchema), '/firewalls');
  }

  async find(search: string) {
    search = search.toLowerCase();
    const items = await this.list();

    const found = items.find((item) => {
      const id = item.id.toLowerCase();
      const name = item.name?.toLowerCase();

      if (id.search(search) || name?.search(search)) {
        return item;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  create(data: FirewallConfig) {
    if (!isFirewallConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(FirewallResultSchema, '/firewalls', {
      method: 'POST',
      body,
    });
  }

  rename(id: string, data: FirewallConfig) {
    invariant(id, 'ID is required');

    if (!isFirewallConfig(data)) {
      throw new Error('Invalid data');
    }

    data.region = this.regionCode;
    const body = JSON.stringify(data);

    return this.request(SimpleResponseSchema, `/firewalls/${id}`, {
      method: 'PUT',
      body,
    });
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/firewalls/${id}`, {
      method: 'DELETE',
    });
  }

  createRule(data: FirewallRuleConfig) {
    if (!isFirewallRuleConfig(data)) {
      throw new Error('Invalid data');
    }

    data.region = this.regionCode;
    const body = JSON.stringify(data);

    return this.request(FirewallRuleSchema, '/firewalls', {
      method: 'POST',
      body,
    });
  }

  listRules(id: string) {
    invariant(id, 'ID is required');

    return this.request(z.array(FirewallRuleSchema), `/firewalls/${id}/rules`);
  }

  async findRule(firewallId: string, search: string) {
    invariant(firewallId, 'Firewall id is required');

    search = search.toLowerCase();
    const items = await this.listRules(firewallId);

    const found = items.find((item) => {
      const id = item?.id?.toLowerCase();

      if (id?.search(search)) {
        return item;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  destroyRule(id: string, ruleId: string) {
    invariant(id, 'ID is required');
    invariant(ruleId, 'Rule id is required');

    return this.request(
      SimpleResponseSchema,
      `/firewalls/${id}/rules/${ruleId}`,
      { method: 'DELETE' },
    );
  }
}
