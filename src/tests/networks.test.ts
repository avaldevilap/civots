import { expect, test, afterAll } from 'vitest';
import { Civo } from '..';
import { faker } from '@faker-js/faker';

const client = new Civo({
  apiKey: import.meta.env.API_KEY,
});

afterAll(async () => {
  const networks = await client.networks.listNetworks();
  networks.forEach((network) => {
    if (!network.default) {
      client.networks.deleteNetwork(network.id);
    }
  });
});

test('create a new network', async () => {
  const networks = await client.networks.listNetworks();
  const newNetwork = await client.networks.newNetwork(
    `test-${faker.internet.domainWord()}`,
  );

  expect(networks.length).toBeGreaterThan(0);
  expect(newNetwork.result).toBe('success');
});

test('get all networks', async () => {
  const networks = await client.networks.listNetworks();

  expect(networks).toBeTruthy();
});
