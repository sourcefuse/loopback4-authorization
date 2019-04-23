import {
  Constructor,
  inject,
  MetadataInspector,
  Provider,
} from '@loopback/context';
import {CoreBindings} from '@loopback/core';

import {AUTHORISATION_METADATA_ACCESSOR} from '../keys';
import {AuthorisationMetadata} from '../types';

export class AuthorisationMetadataProvider
  implements Provider<AuthorisationMetadata | undefined> {
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS)
    private readonly controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME)
    private readonly methodName: string,
  ) {}

  value(): AuthorisationMetadata | undefined {
    return getAuthoriseMetadata(this.controllerClass, this.methodName);
  }
}

export function getAuthoriseMetadata(
  controllerClass: Constructor<{}>,
  methodName: string,
): AuthorisationMetadata | undefined {
  return MetadataInspector.getMethodMetadata<AuthorisationMetadata>(
    AUTHORISATION_METADATA_ACCESSOR,
    controllerClass.prototype,
    methodName,
  );
}
