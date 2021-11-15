import {BindingKey} from '@loopback/context';
import {MetadataAccessor} from '@loopback/metadata';
import {
  AuthorizeFn,
  AuthorizationMetadata,
  UserPermissionsFn,
  AuthorizationConfig,
  CasbinAuthorizeFn,
  CasbinEnforcerConfigGetterFn,
  CasbinResourceModifierFn,
} from './types';

/**
 * Binding keys used by this component.
 */
export namespace AuthorizationBindings {
  export const AUTHORIZE_ACTION = BindingKey.create<AuthorizeFn>(
    'sf.userAuthorization.actions.authorize',
  );

  export const CASBIN_AUTHORIZE_ACTION = BindingKey.create<CasbinAuthorizeFn>(
    'sf.userAuthorization.actions.casbin.authorize',
  );

  export const METADATA = BindingKey.create<AuthorizationMetadata | undefined>(
    'sf.userAuthorization.operationMetadata',
  );

  export const USER_PERMISSIONS = BindingKey.create<UserPermissionsFn<string>>(
    'sf.userAuthorization.actions.userPermissions',
  );

  export const CASBIN_ENFORCER_CONFIG_GETTER =
    BindingKey.create<CasbinEnforcerConfigGetterFn>(
      'sf.userAuthorization.actions.casbin.config',
    );

  export const CASBIN_RESOURCE_MODIFIER_FN =
    BindingKey.create<CasbinResourceModifierFn>(
      'sf.userAuthorization.actions.casbin.resourceModifier',
    );

  export const CONFIG = BindingKey.create<AuthorizationConfig>(
    'sf.userAuthorization.config',
  );

  export const PATHS_TO_ALLOW_ALWAYS = 'sf.userAuthorization.allowAlways';
}

export const AUTHORIZATION_METADATA_ACCESSOR = MetadataAccessor.create<
  AuthorizationMetadata,
  MethodDecorator
>('sf.userAuthorization.accessor.operationMetadata');
