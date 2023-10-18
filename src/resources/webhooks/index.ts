import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { Base } from '..';
import { isWebhookConfig, WebhookConfig, WebhookSchema } from './types';

export class WebhookApi extends Base {
  list() {
    return this.request(z.array(WebhookSchema), '/webhooks');
  }

  async find(search: string) {
    search = search.toLowerCase();
    const items = await this.list();

    const found = items.find((item) => {
      const id = item.id.toLowerCase();
      const url = item.url?.toLowerCase();

      if (id.search(search) || url?.search(search)) {
        return item;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  create(data: WebhookConfig) {
    if (!isWebhookConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(WebhookSchema, '/webhooks', { method: 'POST', body });
  }

  update(id: string, data: WebhookConfig) {
    invariant(id, 'ID is required');
    if (!isWebhookConfig(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(WebhookSchema, `/webhooks/${id}`, {
      method: 'PUT',
      body,
    });
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/webhooks/${id}`, {
      method: 'DELETE',
    });
  }
}
