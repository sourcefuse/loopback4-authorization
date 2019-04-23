import {Getter, inject, Provider} from '@loopback/context';

import {AuthorisatonBindings} from '../keys';
import {AuthorisationMetadata, AuthoriseFn} from '../types';

import {intersection} from 'lodash';

export class AuthoriseActionProvider implements Provider<AuthoriseFn> {
  constructor(
    @inject.getter(AuthorisatonBindings.METADATA)
    private readonly getMetadata: Getter<AuthorisationMetadata>,
  ) {}

  value(): AuthoriseFn {
    return response => this.action(response);
  }

  async action(userPermissions: string[]): Promise<boolean> {
    const metadata: AuthorisationMetadata = await this.getMetadata();
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
