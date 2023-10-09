import invariant from 'tiny-invariant';

import { Base } from '..';
import { UserEverythingSchema } from './types';

export class UserApi extends Base {
  list(user_id: string) {
    invariant(user_id, 'User id is required');

    return this.request(UserEverythingSchema, `/users/${user_id}/everything`);
  }
}
