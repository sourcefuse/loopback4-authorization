import {Component, ProviderMap, Binding, inject} from '@loopback/core';

import {AuthorizationBindings} from './keys';
import {AuthorizeActionProvider} from './providers/authorization-action.provider';
import {AuthorizationMetadataProvider} from './providers/authorization-metadata.provider';
import {UserPermissionsProvider} from './providers/user-permissions.provider';
import {AuthorizationConfig} from './types';
import {CustomAuthorizeActionProvider} from './providers/custom-authorization-action.provider';

export class AuthorizationComponent implements Component {
  providers?: ProviderMap;
  bindings?: Binding[];

  constructor(
    @inject(AuthorizationBindings.CONFIG)
    private readonly config?: AuthorizationConfig,
  ) {
    this.providers = {
      [AuthorizationBindings.AUTHORIZE_ACTION.key]: AuthorizeActionProvider,
      [AuthorizationBindings.CUSTOM_AUTHORIZE_ACTION
        .key]: CustomAuthorizeActionProvider,
      [AuthorizationBindings.METADATA.key]: AuthorizationMetadataProvider,
      [AuthorizationBindings.USER_PERMISSIONS.key]: UserPermissionsProvider,
    };

    if (
      config &&
      config.allowAlwaysPaths &&
      config.allowAlwaysPaths.length > 0
    ) {
      this.bindings = [
        Binding.bind(AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS).to(
          config.allowAlwaysPaths,
        ),
      ];
    } else {
      this.bindings = [
        Binding.bind(AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS).to([
          '/explorer',
        ]),
      ];
    }
  }
}
