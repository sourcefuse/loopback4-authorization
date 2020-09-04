import { Request } from '@loopback/rest';
import * as casbin from 'casbin';
import PostgresAdapter from "casbin-pg-adapter";


/**
 * Authorize action method interface
 */
export interface AuthorizeFn {
  // userPermissions - Array of permission keys granted to the user
  // This is actually a union of permissions picked up based on role
  // attached to the user and allowed permissions at specific user level
  (userPermissions: string[], request?: Request): Promise<boolean>;
}

/**
 * Authorize action method interface
 */
export interface CasbinAuthorizeFn {
  // userPermissions - Array of permission keys granted to the user
  // This is actually a union of permissions picked up based on role
  // attached to the user and allowed permissions at specific user level
  (enforcer: casbin.Enforcer, userId: string): Promise<boolean>;
}
/**
 * Authorization metadata interface for the method decorator
 */
export interface AuthorizationMetadata {
  // Array of permissions required at the method level.
  // User need to have at least one of these to access the API method.
  permissions: string[];
}

export interface CasbinAuthorizationMetadata {
  /**
   * Roles that are allowed access
   */
  allowedRoles?: string[];
  /**
   * Roles that are denied access
   */
  deniedRoles?: string[];
  /**
   * Voters that help make the authorization decision
   */
  // voters?: (Authorizer | BindingAddress<Authorizer>)[];
  /**
   * Name of the resource, default to the method name
   */
  resource?: string;
  /**
   * Define the access scopes
   */
  scopes?: string[];
  /**
   * A flag to skip authorization
   */
  skip?: boolean;
}

/**
 * Request context for authorization
 */
// export interface AuthorizationContext {
//   /**
//    * An array of principals identified for the request - it should come from
//    * authentication
//    */
//   principals: Principal[];
//   /**
//    * An array of roles for principals
//    */
//   roles: Role[];
//   /**
//    * An array of scopes representing granted permissions - usually come from
//    * access tokens
//    */
//   scopes: string[];
//   /**
//    * An name for the target resource to be accessed, such as
//    * `OrderController.prototype.cancelOrder`
//    */
//   resource: string;
//   /**
//    * Context for the invocation
//    */
//   invocationContext: InvocationContext;
// }

// export interface Principal {
//   /**
//    * Name/id
//    */
//   id: string;
//   [attribute: string]: any;
// }

// export interface Role extends Principal {
//   name: string;
// }

/**
 * Authorization config type for providing config to the component
 */
export interface AuthorizationConfig {
  /**
   * Specify paths to always allow. No permissions check needed.
   */
  allowAlwaysPaths: string[];
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

export interface CasbinEnforcerFn<T> {
  (model: T, policy: T | PostgresAdapter): Promise<casbin.Enforcer>;
}
