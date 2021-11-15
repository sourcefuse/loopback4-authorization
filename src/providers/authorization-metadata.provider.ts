import {
  Constructor,
  inject,
  MetadataInspector,
  Provider,
} from '@loopback/context';
import {CoreBindings} from '@loopback/core';

import {AUTHORIZATION_METADATA_ACCESSOR} from '../keys';
import {AuthorizationMetadata} from '../types';

export class AuthorizationMetadataProvider
  implements Provider<AuthorizationMetadata | undefined>
{
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS, {optional: true})
    private readonly controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME, {optional: true})
    private readonly methodName: string,
  ) {}

  value(): AuthorizationMetadata | undefined {
    if (!this.controllerClass || !this.methodName) return;
    return getAuthorizeMetadata(this.controllerClass, this.methodName);
  }
}

export function getAuthorizeMetadata(
  controllerClass: Constructor<{}>,
  methodName: string,
): AuthorizationMetadata | undefined {
  return MetadataInspector.getMethodMetadata<AuthorizationMetadata>(
    AUTHORIZATION_METADATA_ACCESSOR,
    controllerClass.prototype,
    methodName,
  );
}
