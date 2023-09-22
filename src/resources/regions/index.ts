import { z } from 'zod';

import { Base } from '../base';
import { RegionSchema } from './types';

export class Regions extends Base {
  listRegions() {
    return this.request(z.array(RegionSchema), {
      route: '/regions',
      params: undefined,
    });
  }

  async findRegion(search: string) {
    search = search.toLowerCase();
    const regions = await this.listRegions();

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

  async getDefaultRegion() {
    const regions = await this.listRegions();
    const found = regions.find((region) => region.default);

    if (found) {
      return found;
    }

    throw new Error('No default region found');
  }
}
