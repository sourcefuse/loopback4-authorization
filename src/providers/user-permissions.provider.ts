import {Provider} from '@loopback/context';

import {UserPermission, UserPermissionsFn} from '../types';

export class UserPermissionsProvider
  implements Provider<UserPermissionsFn<string>>
{
  constructor() {}

  value(): UserPermissionsFn<string> {
    return (userPermissions, rolePermissions) =>
      this.action(userPermissions, rolePermissions);
  }

  action(
    userPermissions: UserPermission<string>[],
    rolePermissions: string[],
  ): string[] {
    let perms: string[] = [];
    // First add all permissions associated with role
    perms = perms.concat(rolePermissions);
    // Now update permissions based on user permissions
    userPermissions.forEach((userPerm: UserPermission<string>) => {
      if (userPerm.allowed && perms.indexOf(userPerm.permission) < 0) {
        // Add permission if it is not part of role but allowed to user
        perms.push(userPerm.permission);
      } else if (!userPerm.allowed && perms.indexOf(userPerm.permission) >= 0) {
        // Remove permission if it is disallowed for user
        perms.splice(perms.indexOf(userPerm.permission), 1);
      }
    });
    return perms;
  }
}
