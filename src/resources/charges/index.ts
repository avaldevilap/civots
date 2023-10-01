import invariant from 'tiny-invariant';
import { z } from 'zod';

import { Base } from '..';
import { ChargeSchema } from './types';

export class ChargeApi extends Base {
  list(from: string | Date, to: string | Date) {
    invariant(from, 'From is required');
    invariant(to, 'To is required');

    const searchParams = new URLSearchParams();
    searchParams.set('from', z.coerce.date().parse(from).toISOString());
    searchParams.set('to', z.coerce.date().parse(to).toISOString());

    return this.request(
      z.array(ChargeSchema),
      `/charges${searchParams.toString()}`,
    );
  }
}
