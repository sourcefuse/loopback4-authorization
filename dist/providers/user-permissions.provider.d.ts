import { Provider } from '@loopback/context';
import { UserPermission, UserPermissionsFn } from '../types';
export declare class UserPermissionsProvider implements Provider<UserPermissionsFn<string>> {
    constructor();
    value(): UserPermissionsFn<string>;
    action(userPermissions: UserPermission<string>[], rolePermissions: string[]): string[];
}
