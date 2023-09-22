# civots
Typescript client for Civo API

```typescript
import { Civo } from 'civots';

const client = new Civo({
  apiKey: '<CIVO_API_KEY>',
  regionCode: '<REGION_CODE>', // 'LON1' by default
});

const network = await client.networks.getDefaultNetwork();

const clusters = await client.kubernetes.listKubernetesClusters();

const cluster = await client.kubernetes.newKubernetesClusters({
  name: 'mycluster',
  network_id: network.id,
});
```
