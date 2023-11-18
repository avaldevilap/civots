import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { Base } from '../base';;
import { RoleSchema } from './types';

export class RoleApi extends Base {
  list() {
    return this.request(z.array(RoleSchema), '/roles');
  }

  create(name: string, permissions: string) {
    invariant(name, 'Name is required');
    invariant(permissions, 'Name is required');

    const body = JSON.stringify({ name, permissions });

    return this.request(RoleSchema, '/roles', { method: 'POST', body });
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/roles/${id}`, {
      method: 'DELETE',
    });
  }
}
