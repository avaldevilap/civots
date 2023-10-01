import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { Base } from '..';
import {
  DNSDomain,
  DNSDomainSchema,
  DNSRecord,
  DNSRecordConfig,
  DNSRecordSchema,
  isDNSRecord,
  isDNSRecordConfig,
} from './types';

export class DNSDomainApi extends Base {
  list() {
    return this.request(z.array(DNSDomainSchema), '/dns');
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

  create(name: string) {
    invariant(name, 'Name is required');

    const body = JSON.stringify({ name });

    return this.request(DNSDomainSchema, '/dns', { method: 'POST', body });
  }

  async get(name: string) {
    invariant(name, 'Name is required');

    const items = await this.list();
    const found = items.find((item) => item.name.includes(name));
    if (found) {
      return found;
    }
    throw new Error('DNS Domain not found');
  }

  update(name: string, data: DNSDomain) {
    invariant(name, 'Name is required');

    const body = JSON.stringify({ name });

    return this.request(DNSDomainSchema, `/dns/${data.id}`, {
      method: 'PUT',
      body,
    });
  }

  destroy(data: DNSDomain) {
    return this.request(SimpleResponseSchema, `/dns/${data.id}`, {
      method: 'DELETE',
    });
  }

  createRecord(domainId: string, data: DNSRecordConfig) {
    invariant(domainId, 'Domain id is required');

    const body = JSON.stringify(data);

    return this.request(DNSRecordSchema, `/dns/${domainId}/records`, {
      method: 'POST',
      body,
    });
  }

  listRecords(domainId: string) {
    invariant(domainId, 'Domain id is required');

    return this.request(z.array(DNSRecordSchema), `/dns/${domainId}/records`);
  }

  async getRecord(domainId: string) {
    invariant(domainId, 'Domain id is required');

    const items = await this.listRecords(domainId);
    const found = items.find((item) => item.id === domainId);
    if (found) {
      return found;
    }
    throw new Error('DNS Record not found');
  }

  updateRecord(record: DNSRecord, data: DNSRecordConfig) {
    if (!isDNSRecord(data)) {
      throw new Error('Invalid record data');
    }
    if (!isDNSRecordConfig(data)) {
      throw new Error('Invalid record config data');
    }

    const body = JSON.stringify(data);

    return this.request(
      DNSRecordSchema,
      `/dns/${record.domain_id}/records/${record.id}`,
      { method: 'PUT', body },
    );
  }

  destroyRecord(data: DNSRecord) {
    if (!isDNSRecord(data)) {
      throw new Error('Invalid data');
    }

    return this.request(
      SimpleResponseSchema,
      `/dns/${data.domain_id}/records/${data.id}`,
      { method: 'DELETE' },
    );
  }
}
