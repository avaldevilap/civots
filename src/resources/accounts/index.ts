import { Base } from '..';
import { PaginatedAccountsSchema } from './types';

export class AccountApi extends Base {
  /**
   * Retrieves a list of accounts.
   * @returns {Promise<Array<Account>>} A promise that resolves to the list of accounts.
   */
  list() {
    return this.request(PaginatedAccountsSchema, '/accounts');
  }

  /**
   * Retrieves the ID of the first account in the list.
   * @returns {Promise<string>} A promise that resolves to the ID of the first account.
   */
  async get() {
    const accounts = await this.list();

    return accounts.items[0].id;
  }
}
