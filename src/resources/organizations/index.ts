import invariant from 'tiny-invariant';
import { z } from 'zod';

import { Base } from '../base';;
import { AccountSchema, OrganizationSchema } from './types';

export class OrganizationApi extends Base {
  get() {
    return this.request(OrganizationSchema, '/organization');
  }

  create(name: string) {
    invariant(name, 'Name is required');

    const body = JSON.stringify({ name });

    return this.request(OrganizationSchema, '/organization', {
      method: 'POST',
      body,
    });
  }

  rename(name: string) {
    invariant(name, 'Name is required');

    const body = JSON.stringify({ name });

    return this.request(OrganizationSchema, '/organization', {
      method: 'PUT',
      body,
    });
  }

  addAccount(organization_id: string, organization_token: string) {
    invariant(organization_id, 'Organization id is required');
    invariant(organization_token, 'Organization token is required');

    const body = JSON.stringify({ organization_id, organization_token });

    return this.request(z.array(AccountSchema), '/organization/accounts', {
      method: 'POST',
      body,
    });
  }

  listAccounts() {
    return this.request(z.array(AccountSchema), '/organization/accounts');
  }
}
