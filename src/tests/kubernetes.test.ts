import { expect, test } from 'vitest';
import { Civo } from '..';

const client = new Civo({
  apiKey: import.meta.env.API_KEY,
  regionCode: 'LON1',
});

test('create a new cluster', async () => {
  const network = await client.networks.getDefault();
  const clusters = await client.kubernetes.listKubernetesClusters();
  if (clusters.items.length === 0) {
    const cluster = await client.kubernetes.newKubernetesClusters({
      name: 'mycluster',
      network_id: network.id,
    });
    expect(cluster).toBeTruthy();
  }

  expect(clusters.items[0].network_id).toBeTypeOf('string');
  expect(clusters.items.length).toBeGreaterThan(0);
});

test('get all clusters', async () => {
  const clusters = await client.kubernetes.listKubernetesClusters();

  expect(clusters).toBeTruthy();
});
