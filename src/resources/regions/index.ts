import { z } from 'zod';

import { Base } from '../base';
import { RegionSchema } from './types';

export class RegionsApi extends Base {
  list() {
    const searchParams = new URLSearchParams({ region: this.regionCode });
    return this.request(z.array(RegionSchema), {
      url: '/regions',
      searchParams,
    });
  }

  async find(search: string) {
    search = search.toLowerCase();
    const regions = await this.list();

    const found = regions.find((region) => {
      const name = region.name.toLowerCase();
      const code = region.code.toLowerCase();

      if (name.search(search) || code.search(search)) {
        return region;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  async getDefault() {
    const regions = await this.list();
    const found = regions.find((region) => region.default);

    if (found) {
      return found;
    }

    throw new Error('No default region found');
  }
}
