import { Base } from '..';
import {
  type ActionListRequest,
  isActionListRequest,
  PaginateActionListSchema,
} from './types';

export class ActionApi extends Base {
  list(listRequest: ActionListRequest) {
    if (!isActionListRequest(listRequest)) {
      throw new Error('Invalid data');
    }

    const searchParams = new URLSearchParams();
    for (const property in listRequest) {
      searchParams.set(
        property,
        String(listRequest[property as keyof typeof listRequest]),
      );
    }

    return this.request(
      PaginateActionListSchema,
      `/actions${searchParams.toString()}`,
    );
  }
}
