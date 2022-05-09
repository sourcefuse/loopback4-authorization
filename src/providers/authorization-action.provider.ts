import {Getter, inject, Provider} from '@loopback/context';

import {AuthorizationBindings} from '../keys';
import {AuthorizationMetadata, AuthorizeFn} from '../types';

import {intersection} from 'lodash';
import {Request} from 'express';
import {HttpErrors, RestBindings} from '@loopback/rest';
import {CoreBindings, Context} from '@loopback/core';

export class AuthorizeActionProvider implements Provider<AuthorizeFn> {
  constructor(
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getMetadata: Getter<AuthorizationMetadata>,
    @inject(AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS)
    private readonly allowAlwaysPath: string[],
    @inject(RestBindings.Http.CONTEXT)
    private readonly requestConext: Context,
  ) {}

  value(): AuthorizeFn {
    return (response, req) => this.action(response, req);
  }

  async action(userPermissions: string[], request?: Request): Promise<boolean> {
    const metadata: AuthorizationMetadata = await this.getMetadata();
    let methodName = '';
    try {
      methodName = await this.requestConext.get(
        CoreBindings.CONTROLLER_METHOD_NAME,
      );
    } catch (error) {
      throw new HttpErrors.NotFound("API not found !");
    }

    if (request && this.checkIfAllowedAlways(request)) {
      return true;
    } else if (!metadata) {
      return false;
    } else if (metadata.permissions.indexOf('*') === 0) {
      // Return immediately with true, if allowed to all
      // This is for publicly open routes only
      return true;
    }
    const permissionsToCheck = metadata.permissions;
    return intersection(userPermissions, permissionsToCheck).length > 0;
  }

  checkIfAllowedAlways(req: Request): boolean {
    let allowed = false;
    allowed = !!this.allowAlwaysPath.find(path => req.path.indexOf(path) === 0);
    return allowed;
  }
}
