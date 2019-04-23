import {MethodDecoratorFactory} from '@loopback/core';
import {AuthorisationMetadata} from '../types';
import {AUTHORISATION_METADATA_ACCESSOR} from '../keys';

export function authorise(permissions: string[]) {
  return MethodDecoratorFactory.createDecorator<AuthorisationMetadata>(
    AUTHORISATION_METADATA_ACCESSOR,
    {
      permissions: permissions || [],
    },
  );
}
