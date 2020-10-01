import {
  Binding,
  Component,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {AuthorizationBindings} from './keys';
import {AuthorizeActionProvider} from './providers/authorization-action.provider';
import {AuthorizationMetadataProvider} from './providers/authorization-metadata.provider';
import {CasbinAuthorizationProvider} from './providers/casbin-authorization-action.provider';
import {UserPermissionsProvider} from './providers/user-permissions.provider';
import {AuthorizationConfig} from './types';

export class AuthorizationComponent implements Component {
  providers?: ProviderMap;
  bindings?: Binding[];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(AuthorizationBindings.CONFIG)
    private readonly config?: AuthorizationConfig,
  ) {
    this.providers = {
      [AuthorizationBindings.AUTHORIZE_ACTION.key]: AuthorizeActionProvider,
      [AuthorizationBindings.CASBIN_AUTHORIZE_ACTION
        .key]: CasbinAuthorizationProvider,
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
