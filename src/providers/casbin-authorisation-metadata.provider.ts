import {
  Constructor,
  inject,
  MetadataInspector,
  Provider,
} from '@loopback/context';
import { CoreBindings } from '@loopback/core';

import { CASBIN_AUTHORIZATION_METADATA_ACCESSOR } from '../keys';
import { CasbinAuthorizationMetadata } from '../types';

export class CasbinAuthorizationMetadataProvider
  implements Provider<CasbinAuthorizationMetadata | undefined> {
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS, { optional: true })
    private readonly controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME, { optional: true })
    private readonly methodName: string,
  ) { }

  value(): CasbinAuthorizationMetadata | undefined {
    if (!this.controllerClass || !this.methodName) return;
    return getCasbinAuthorizeMetadata(this.controllerClass, this.methodName);
  }
}

export function getCasbinAuthorizeMetadata(
  controllerClass: Constructor<{}>,
  methodName: string,
): CasbinAuthorizationMetadata | undefined {
  return MetadataInspector.getMethodMetadata<CasbinAuthorizationMetadata>(
    CASBIN_AUTHORIZATION_METADATA_ACCESSOR,
    controllerClass.prototype,
    methodName,
  );
}
