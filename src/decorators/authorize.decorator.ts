import {
  MetadataInspector,
  MethodDecoratorFactory,
  Reflector,
} from '@loopback/core';
import {AuthorizationMetadata} from '../types';
import {AUTHORIZATION_METADATA_ACCESSOR} from '../keys';
import {specPreprocessor} from './spec-preprocessor';
import {OperationObject} from '@loopback/rest';

type OperationMeta = {
  verb: string;
  path: string;
  spec: OperationObject;
};

const OAI3KEY_METHODS = 'openapi-v3:methods';

export function authorize(metadata: AuthorizationMetadata) {
  const authorizedecorator =
    MethodDecoratorFactory.createDecorator<AuthorizationMetadata>(
      AUTHORIZATION_METADATA_ACCESSOR,
      {
        permissions: metadata.permissions || [],
        resource: metadata.resource ?? '',
        isCasbinPolicy: metadata.isCasbinPolicy ?? false,
      },
    );
  const authorizationWithMetadata = <T>(
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ) => {
    const meta: OperationMeta | undefined = MetadataInspector.getMethodMetadata(
      OAI3KEY_METHODS,
      target,
      propertyKey,
    );
    if (meta) {
      meta.spec = specPreprocessor(target, propertyKey, metadata, meta.spec);
      Reflector.deleteMetadata(OAI3KEY_METHODS, target, propertyKey);
      Reflector.defineMetadata(OAI3KEY_METHODS, meta, target, propertyKey);
      authorizedecorator(target, propertyKey, descriptor);
    }
  };

  return authorizationWithMetadata;
}
