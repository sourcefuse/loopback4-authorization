/**
 * Authorize action method interface
 */
export interface AuthorizeFn {
  // userPermissions - Array of permission keys granted to the user
  // This is actually a union of permissions picked up based on role
  // attached to the user and allowed permissions at specific user level
  (userPermissions: string[]): Promise<boolean>;
}

/**
 * Authorization metadata interface for the method decorator
 */
export interface AuthorizationMetadata {
  // Array of permissions required at the method level.
  // User need to have at least one of these to access the API method.
  permissions: string[];
}

/**
 * Permissions interface to be implemented by models
 */
export interface Permissions<T> {
  permissions: T[];
}

/**
 * Override permissions at user level
 */
export interface UserPermissionsOverride<T> {
  permissions: UserPermission<T>[];
}

/**
 * User Permission model
 * used for explicit allow/deny any permission at user level
 */
export interface UserPermission<T> {
  permission: T;
  allowed: boolean;
}

/**
 * User permissions manipulation method interface.
 *
 * This is where we can add our business logic to read and
 * union permissions associated to user via role with
 * those associated directly to the user.
 *
 */
export interface UserPermissionsFn<T> {
  (userPermissions: UserPermission<T>[], rolePermissions: T[]): T[];
}
