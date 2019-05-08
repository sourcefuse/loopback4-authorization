import {BindingKey} from '@loopback/context';
import {MetadataAccessor} from '@loopback/metadata';
import {AuthorizeFn, AuthorizationMetadata, UserPermissionsFn} from './types';

/**
 * Binding keys used by this component.
 */
export namespace AuthorizatonBindings {
  export const AUTHORIZE_ACTION = BindingKey.create<AuthorizeFn>(
    'sf.userAuthorization.actions.authorize',
  );

  export const METADATA = BindingKey.create<AuthorizationMetadata | undefined>(
    'sf.userAuthorization.operationMetadata',
  );

  export const USER_PERMISSIONS = BindingKey.create<UserPermissionsFn<string>>(
    'sf.userAuthorization.actions.userPermissions',
  );
}

export const AUTHORIZATION_METADATA_ACCESSOR = MetadataAccessor.create<
  AuthorizationMetadata,
  MethodDecorator
>('userAuthorization.accessor.operationMetadata');
