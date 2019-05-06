import {Getter, inject, Provider} from '@loopback/context';

import {AuthorizatonBindings} from '../keys';
import {AuthorizationMetadata, AuthorizeFn} from '../types';

import {intersection} from 'lodash';

export class AuthorizeActionProvider implements Provider<AuthorizeFn> {
  constructor(
    @inject.getter(AuthorizatonBindings.METADATA)
    private readonly getMetadata: Getter<AuthorizationMetadata>,
  ) {}

  value(): AuthorizeFn {
    return response => this.action(response);
  }

  async action(userPermissions: string[]): Promise<boolean> {
    const metadata: AuthorizationMetadata = await this.getMetadata();
    if (!metadata) {
      return false;
    } else if (metadata.permissions.indexOf('*') === 0) {
      // Return immediately with true, if allowed to all
      // This is for publicly open routes only
      return true;
    }
    const permissionsToCheck = metadata.permissions;
    return intersection(userPermissions, permissionsToCheck).length > 0;
  }
}
