import { Base } from '..';
import { PaginatedAccountsSchema } from './types';

export class AccountApi extends Base {
  list() {
    return this.request(PaginatedAccountsSchema, '/accounts');
  }

  async get() {
    const accounts = await this.list();

    return accounts.items[0].id;
  }
}
