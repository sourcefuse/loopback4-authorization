import { BindingKey } from '@loopback/context';
import { MetadataAccessor } from '@loopback/metadata';
import {
  AuthorizeFn,
  AuthorizationMetadata,
  UserPermissionsFn,
  AuthorizationConfig,
  CasbinAuthorizationMetadata,
  CasbinEnforcerFn,
  CasbinAuthorizeFn,
} from './types';

/**
 * Binding keys used by this component.
 */
export namespace AuthorizationBindings {
  export const AUTHORIZE_ACTION = BindingKey.create<AuthorizeFn>(
    'sf.userAuthorization.actions.authorize',
  );

  export const CASBIN_AUTHORIZE_ACTION = BindingKey.create<CasbinAuthorizeFn>(
    'sf.userCasbinAuthorization.actions.authorize',
  );

  export const METADATA = BindingKey.create<AuthorizationMetadata | undefined>(
    'sf.userAuthorization.operationMetadata',
  );

  export const CASBIN_METADATA = BindingKey.create<CasbinAuthorizationMetadata | undefined>(
    'sf.userCasbinAuthorization.operationMetadata',
  );

  export const USER_PERMISSIONS = BindingKey.create<UserPermissionsFn<string>>(
    'sf.userAuthorization.actions.userPermissions',
  );

  export const CASBIN_ENFORCER = BindingKey.create<CasbinEnforcerFn<string>>(
    'sf.userCasbinAuthorization.casbinenforcer',
  );

  export const CONFIG = BindingKey.create<AuthorizationConfig>(
    'sf.userAuthorization.config',
  );

  export const PATHS_TO_ALLOW_ALWAYS = 'sf.userAuthorization.allowAlways';


  export const RESOURCE_ID = BindingKey.create<string>('sf.resourceId');
}

export const AUTHORIZATION_METADATA_ACCESSOR = MetadataAccessor.create<
  AuthorizationMetadata,
  MethodDecorator
>('sf.userAuthorization.accessor.operationMetadata');

export const CASBIN_AUTHORIZATION_METADATA_ACCESSOR = MetadataAccessor.create<
  CasbinAuthorizationMetadata,
  MethodDecorator
>('sf.userCasbinAuthorization.accessor.operationMetadata');
