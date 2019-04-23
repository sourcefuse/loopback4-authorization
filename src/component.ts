import {Component, ProviderMap} from '@loopback/core';
import {AuthorisatonBindings} from './keys';
import {AuthoriseActionProvider} from './providers/authorisation-action.provider';
import {AuthorisationMetadataProvider} from './providers/authorisation-metadata.provider';
import {UserPermissionsProvider} from './providers/user-permissions.provider';

export class AuthorisationComponent implements Component {
  providers?: ProviderMap;

  constructor() {
    this.providers = {
      [AuthorisatonBindings.AUTHORISE_ACTION.key]: AuthoriseActionProvider,
      [AuthorisatonBindings.METADATA.key]: AuthorisationMetadataProvider,
      [AuthorisatonBindings.USER_PERMISSIONS.key]: UserPermissionsProvider,
    };
  }
}
