import { MethodDecoratorFactory } from '@loopback/core';
import { AuthorizationMetadata } from '../types';
import { AUTHORIZATION_METADATA_ACCESSOR } from '../keys';

export function authorize(metadata: AuthorizationMetadata) {
  return MethodDecoratorFactory.createDecorator<AuthorizationMetadata>(
    AUTHORIZATION_METADATA_ACCESSOR,
    {
      permissions: metadata.permissions || [],
      resource: metadata.resource || '',
      isCasbinPolicy: metadata.isCasbinPolicy || false
    },
  );
}
