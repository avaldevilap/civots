import { expect, test } from 'vitest';
import { Civo } from '..';

const client = new Civo({
  apiKey: 'NUBLXW5cAz01M26drb0Pj9FiVl7uxZ4nmQsgapvRKhyGIwDkfq',
});

test('get all regions', async () => {
  const regions = await client.regions.listRegions();

  expect(regions.length).toBeGreaterThan(0);
});
