import {MethodDecoratorFactory} from '@loopback/core';
import {AuthorizationMetadata} from '../types';
import {AUTHORIZATION_METADATA_ACCESSOR} from '../keys';

export function authorize(permissions: string[]) {
  return MethodDecoratorFactory.createDecorator<AuthorizationMetadata>(
    AUTHORIZATION_METADATA_ACCESSOR,
    {
      permissions: permissions || [],
    },
  );
}
