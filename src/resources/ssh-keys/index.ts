import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { Base } from '../base';;
import { SSHKeySchema } from './types';

export class SSHKeyApi extends Base {
  list() {
    return this.request(z.array(SSHKeySchema), '/sshkeys');
  }

  create(name: string, public_key: string) {
    invariant(name, 'Name is required');
    invariant(public_key, 'Public key is required');

    const body = JSON.stringify({ name, public_key });

    return this.request(SimpleResponseSchema, '/sshkeys', {
      method: 'POST',
      body,
    });
  }

  update(name: string, sshKeyId: string) {
    invariant(name, 'Name is required');
    invariant(sshKeyId, 'SSH key id is required');

    const body = JSON.stringify({ name });

    return this.request(SimpleResponseSchema, `/sshkeys/${sshKeyId}`, {
      method: 'PUT',
      body,
    });
  }

  async find(search: string) {
    search = search.toLowerCase();
    const items = await this.list();

    const found = items.find((item) => {
      const id = item.id.toLowerCase();
      const name = item.name.toLowerCase();

      if (id.search(search) || name.search(search)) {
        return item;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/sshkeys/${id}`, {
      method: 'DELETE',
    });
  }
}
