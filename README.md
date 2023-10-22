[![Node.js Package](https://github.com/avaldevilap/civots/actions/workflows/npm-publish.yml/badge.svg?branch=master)](https://github.com/avaldevilap/civots/actions/workflows/npm-publish.yml)

# civots
Typescript client for Civo API

```typescript
import { Civo } from 'civots';

const client = new Civo({
  apiKey: '<CIVO_API_KEY>',
  regionCode: '<REGION_CODE>', // 'NYC1' by default
});

const network = await client.networks.getDefault();

const clusters = await client.kubernetes.listClusters();

const cluster = await client.kubernetes.createCluster({
  name: 'mycluster',
  network_id: network.id,
});
```
