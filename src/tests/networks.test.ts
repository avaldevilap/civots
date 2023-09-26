import { faker } from '@faker-js/faker';
import { afterAll, expect, test } from 'vitest';

import { Civo } from '..';
import { CreateRoute, SubnetConfig } from '../resources/networks/types';

const client = new Civo({
  apiKey: import.meta.env.API_KEY,
  regionCode: 'LON1',
});

afterAll(async () => {
  const networks = await client.networks.list();
  networks.forEach((network) => {
    if (network.label?.startsWith('test-')) {
      client.networks.destroy(network.id);
    }
  });
});

test('create a new network', async () => {
  const networks = await client.networks.list();
  const newNetwork = await client.networks.create(
    `test-${faker.internet.domainWord()}`,
  );

  expect(networks.length).toBeGreaterThan(0);
  expect(newNetwork.result).toBe('success');
});

test('get all networks', async () => {
  const networks = await client.networks.list();

  expect(networks).toBeTruthy();
});

test('should list all subnets in a network', async () => {
  const networkId = '12345678-90ab-cdef-0123-456789abcdef';
  const subnets = await client.subnets.list(networkId);

  expect(subnets).toBeGreaterThan(1);
});

test('should get a subnet by its ID', async () => {
  const networkId = '12345678-90ab-cdef-0123-456789abcdef';
  const subnetId = 'fedcba98-7654-3210-9876-543210fedcba';
  const subnet = await client.subnets.get(networkId, subnetId);

  expect(subnet.id).toBe(subnetId);
});

test('should create a new subnet in a network', async () => {
  const networkId = '12345678-90ab-cdef-0123-456789abcdef';
  const subnetConfig: SubnetConfig = {
    name: 'My new subnet',
  };

  const subnet = await client.subnets.create(networkId, subnetConfig);

  expect(subnet.name).toBe(subnetConfig.name);
});

test('should find a subnet by its name or ID', async () => {
  const networkId = '12345678-90ab-cdef-0123-456789abcdef';
  const subnetName = 'My new subnet';

  const subnet = await client.subnets.find(networkId, subnetName);

  expect(subnet.name).toBe(subnetName);
});

test('should attach a subnet to an instance', async () => {
  const networkId = '12345678-90ab-cdef-0123-456789abcdef';
  const subnetId = 'fedcba98-7654-3210-9876-543210fedcba';
  const routeConfig: CreateRoute = {
    resource_id: '12345678-90ab-cdef-0123-456789abcdef',
    resource_type: '',
  };

  const route = await client.subnets.attachToInstance(
    networkId,
    subnetId,
    routeConfig,
  );

  expect(route.network_id).toBe(networkId);
});

test.todo('should detach a subnet from an instance', async () => {});

test.todo('should delete a subnet', async () => {});
