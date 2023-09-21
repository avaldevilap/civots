import { Base } from '../base';
import type { Region } from './types';

const resourceName = 'regions';

export class Regions extends Base {
  listRegions() {
    return this.request<Region[]>(`/${resourceName}`);
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
