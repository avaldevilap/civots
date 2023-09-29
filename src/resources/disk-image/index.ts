import invariant from 'tiny-invariant';
import { z } from 'zod';

import { Base } from '..';
import { DiskImageSchema } from './types';

export class DiskImagesApi extends Base {
  async list() {
    const diskImages = await this.request(
      z.array(DiskImageSchema),
      '/disk_images',
    );

    return diskImages.filter(({ name }) => !name?.search('k3s'));
  }

  get(id: string) {
    invariant(id, 'ID is required');

    return this.request(DiskImageSchema, `/disk_images/${id}`);
  }

  async find(search: string) {
    search = search.toLowerCase();
    const diskImages = await this.list();

    const found = diskImages.find((diskImage) => {
      const id = diskImage.id.toLowerCase();
      const name = diskImage.name?.toLowerCase();

      if (id.search(search) || name?.search(search)) {
        return diskImage;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }
}
