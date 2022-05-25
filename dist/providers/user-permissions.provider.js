"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPermissionsProvider = void 0;
class UserPermissionsProvider {
    constructor() { }
    value() {
        return (userPermissions, rolePermissions) => this.action(userPermissions, rolePermissions);
    }
    action(userPermissions, rolePermissions) {
        let perms = [];
        // First add all permissions associated with role
        perms = perms.concat(rolePermissions);
        // Now update permissions based on user permissions
        userPermissions.forEach((userPerm) => {
            if (userPerm.allowed && perms.indexOf(userPerm.permission) < 0) {
                // Add permission if it is not part of role but allowed to user
                perms.push(userPerm.permission);
            }
            else if (!userPerm.allowed && perms.indexOf(userPerm.permission) >= 0) {
                // Remove permission if it is disallowed for user
                perms.splice(perms.indexOf(userPerm.permission), 1);
            }
        });
        return perms;
    }
}
exports.UserPermissionsProvider = UserPermissionsProvider;
//# sourceMappingURL=user-permissions.provider.js.map