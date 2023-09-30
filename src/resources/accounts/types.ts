import { z } from 'zod';

import { AccountSchema } from '../organizations/types';

export const PaginatedAccountsSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  pages: z.number(),
  items: z.array(AccountSchema),
});
