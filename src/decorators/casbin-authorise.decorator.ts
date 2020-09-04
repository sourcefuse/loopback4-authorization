import { MethodDecoratorFactory } from '@loopback/core';
import { CasbinAuthorizationMetadata } from '../types';
import { CASBIN_AUTHORIZATION_METADATA_ACCESSOR } from '../keys';

export function casbinAuthorize(metadata: CasbinAuthorizationMetadata) {
  return MethodDecoratorFactory.createDecorator<CasbinAuthorizationMetadata>(
    CASBIN_AUTHORIZATION_METADATA_ACCESSOR,
    {
      allowedRoles: metadata.allowedRoles || [],
      deniedRoles: metadata.deniedRoles || [],
      resource: metadata.resource || '',
      scopes: metadata.scopes || [],
      skip: metadata.skip || false
    },
  );
}
