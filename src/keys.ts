import {BindingKey} from '@loopback/context';
import {MetadataAccessor} from '@loopback/metadata';
import {AuthoriseFn, AuthorisationMetadata, UserPermissionsFn} from './types';

/**
 * Binding keys used by this component.
 */
export namespace AuthorisatonBindings {
  export const AUTHORISE_ACTION = BindingKey.create<AuthoriseFn>(
    'userAuthorisation.actions.authorise',
  );

  export const METADATA = BindingKey.create<AuthorisationMetadata | undefined>(
    'userAuthorisation.operationMetadata',
  );

  export const USER_PERMISSIONS = BindingKey.create<UserPermissionsFn<string>>(
    'userAuthorisation.actions.userPermissions',
  );
}

export const AUTHORISATION_METADATA_ACCESSOR = MetadataAccessor.create<
  AuthorisationMetadata,
  MethodDecorator
>('userAuthorisation.accessor.operationMetadata');
