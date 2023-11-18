import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { Base } from '../base';;
import {
  CreateDatabaseRequest,
  DatabaseBackupCreateRequest,
  DatabaseBackupSchema,
  DatabaseBackupUpdateRequest,
  DatabaseSchema,
  isCreateDatabaseRequest,
  isDatabaseBackupCreateRequest,
  isDatabaseBackupUpdateRequest,
  isRestoreDatabaseRequest,
  isUpdateDatabaseRequest,
  PaginatedDatabasesSchema,
  RestoreDatabaseRequest,
  SupportedSoftwareVersionSchema,
  UpdateDatabaseRequest,
} from './types';

export class DatabaseApi extends Base {
  list() {
    return this.request(PaginatedDatabasesSchema, '/databases');
  }

  get(id: string) {
    invariant(id, 'ID is required');

    return this.request(DatabaseSchema, `/databases/${id}`);
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/databases/${id}`, {
      method: 'DELETE',
    });
  }

  create(data: CreateDatabaseRequest) {
    if (!isCreateDatabaseRequest(data)) {
      throw new Error('Invalid data');
    }

    const body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      body.append(key, String(value));
    });

    return this.request(DatabaseSchema, '/databases', { method: 'POST', body });
  }

  update(id: string, data: UpdateDatabaseRequest) {
    invariant(id, 'ID is required');
    if (!isUpdateDatabaseRequest(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(DatabaseSchema, `/databases/${id}`, {
      method: 'PUT',
      body,
    });
  }

  async find(search: string) {
    search = search.toLowerCase();
    const { items } = await this.list();

    const found = items.find((item) => {
      const id = item.id.toLowerCase();
      const name = item.name?.toLowerCase();

      if (id.search(search) || name?.search(search)) {
        return item;
      }
    });

    if (found) {
      return found;
    }

    throw new Error(`Unable to find ${search}, zero matches`);
  }

  listVersions() {
    return this.request(
      z.record(SupportedSoftwareVersionSchema),
      '/databases/versions',
    );
  }

  restore(id: string, data: RestoreDatabaseRequest) {
    invariant(id, 'ID is required');
    if (!isRestoreDatabaseRequest(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(SimpleResponseSchema, `/databases/${id}/restore`, {
      method: 'POST',
      body,
    });
  }
}

export class DatabaseBackupApi extends Base {
  list(id: string) {
    invariant(id, 'ID is required');

    return this.request(DatabaseBackupSchema, `/databases/${id}/backups`);
  }

  update(id: string, data: DatabaseBackupUpdateRequest) {
    invariant(id, 'ID is required');
    if (!isDatabaseBackupUpdateRequest(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(DatabaseBackupSchema, `/databases/${id}/backups`, {
      method: 'PUT',
      body,
    });
  }

  create(id: string, data: DatabaseBackupCreateRequest) {
    invariant(id, 'ID is required');
    if (!isDatabaseBackupCreateRequest(data)) {
      throw new Error('Invalid data');
    }

    const body = JSON.stringify(data);

    return this.request(DatabaseBackupSchema, `/databases/${id}/backups`, {
      method: 'POST',
      body,
    });
  }
}
