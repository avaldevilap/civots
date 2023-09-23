import { expect, test } from 'vitest';
import { Civo } from '..';

const client = new Civo({
  apiKey: import.meta.env.API_KEY,
});

test('get all regions', async () => {
  const regions = await client.regions.listRegions();

  expect(regions.length).toBeGreaterThan(0);
});
