import invariant from 'tiny-invariant';
import { z } from 'zod';

import { SimpleResponseSchema } from '../../types';
import { Base } from '..';
import { TeamMemberSchema, TeamSchema } from './types';

export class TeamApi extends Base {
  list() {
    return this.request(z.array(TeamSchema), '/teams');
  }

  create(name: string) {
    invariant(name, 'Name is required');

    const body = JSON.stringify({ name });

    return this.request(TeamSchema, '/teams', { method: 'POST', body });
  }

  async find(search: string) {
    search = search.toLowerCase();
    const items = await this.list();

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

  rename(id: string, name: string) {
    invariant(id, 'ID is required');
    invariant(name, 'Name is required');

    const body = JSON.stringify({ name });

    return this.request(TeamSchema, `/teams/${id}`, { method: 'PUT', body });
  }

  destroy(id: string) {
    invariant(id, 'ID is required');

    return this.request(SimpleResponseSchema, `/teams/${id}`, {
      method: 'DELETE',
    });
  }

  listMembers(id: string) {
    invariant(id, 'ID is required');

    return this.request(z.array(TeamMemberSchema), `/teams/${id}/members`);
  }

  addMember(
    team_id: string,
    user_id: string,
    permissions: string,
    roles: string,
  ) {
    invariant(team_id, 'Team ID is required');
    invariant(user_id, 'User ID is required');
    invariant(permissions, 'Permissions is required');
    invariant(roles, 'Roles is required');

    const body = JSON.stringify({ user_id, permissions, roles });

    return this.request(
      z.array(TeamMemberSchema),
      `/teams/${team_id}/members`,
      { method: 'POST', body },
    );
  }

  updateMember(
    team_id: string,
    team_member_id: string,
    permissions: string,
    roles: string,
  ) {
    invariant(team_id, 'Team ID is required');
    invariant(team_member_id, 'Team member id is required');
    invariant(permissions, 'Permissions is required');
    invariant(roles, 'Roles is required');

    const body = JSON.stringify({ permissions, roles });

    return this.request(
      TeamMemberSchema,
      `/teams/${team_id}/members/${team_member_id}`,
      { method: 'PUT', body },
    );
  }

  destroyMember(team_id: string, team_member_id: string) {
    invariant(team_id, 'Team ID is required');
    invariant(team_member_id, 'Team member id is required');

    return this.request(
      SimpleResponseSchema,
      `/teams/${team_id}/members/${team_member_id}`,
      { method: 'DELETE' },
    );
  }
}
