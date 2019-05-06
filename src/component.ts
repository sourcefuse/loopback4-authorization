import {Component, ProviderMap} from '@loopback/core';
import {AuthorizatonBindings} from './keys';
import {AuthorizeActionProvider} from './providers/authorization-action.provider';
import {AuthorizationMetadataProvider} from './providers/authorization-metadata.provider';
import {UserPermissionsProvider} from './providers/user-permissions.provider';

export class AuthorizationComponent implements Component {
  providers?: ProviderMap;

  constructor() {
    this.providers = {
      [AuthorizatonBindings.AUTHORIZE_ACTION.key]: AuthorizeActionProvider,
      [AuthorizatonBindings.METADATA.key]: AuthorizationMetadataProvider,
      [AuthorizatonBindings.USER_PERMISSIONS.key]: UserPermissionsProvider,
    };
  }
}
