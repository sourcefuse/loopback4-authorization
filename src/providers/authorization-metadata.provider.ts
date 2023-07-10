import {
  Constructor,
  inject,
  MetadataInspector,
  Provider,
} from '@loopback/context';
import {CoreBindings} from '@loopback/core';

import {AUTHORIZATION_METADATA_ACCESSOR, AuthorizationBindings} from '../keys';
import {AuthorizationMetadata, PermissionObject} from '../types';

export class AuthorizationMetadataProvider
  implements Provider<AuthorizationMetadata | undefined>
{
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS, {optional: true})
    private readonly controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME, {optional: true})
    private readonly methodName: string,
    @inject(AuthorizationBindings.PERMISSION)
    private permissionObject: PermissionObject,
  ) {}

  value(): AuthorizationMetadata | undefined {
    if (!this.controllerClass || !this.methodName) return;
    return getAuthorizeMetadata(
      this.controllerClass,
      this.methodName,
      this.permissionObject,
    );
  }
}

export function getAuthorizeMetadata(
  controllerClass: Constructor<{}>,
  methodName: string,
  userPermission?: PermissionObject,
): AuthorizationMetadata | undefined {
  const authorizationMetadata =
    MetadataInspector.getMethodMetadata<AuthorizationMetadata>(
      AUTHORIZATION_METADATA_ACCESSOR,
      controllerClass.prototype,
      methodName,
    ) ?? {permissions: []};
  if (userPermission) {
    const methodPermissions =
      userPermission?.[controllerClass.name]?.[methodName];
    if (methodPermissions) {
      authorizationMetadata.permissions = methodPermissions;
    }
  }
  return authorizationMetadata;
}
