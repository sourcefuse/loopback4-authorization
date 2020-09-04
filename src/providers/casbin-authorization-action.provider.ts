import { inject, Provider, Getter, InvocationContext } from '@loopback/core';
import * as casbin from 'casbin';
import { CasbinAuthorizeFn, CasbinAuthorizationMetadata } from '../types';
import { AuthorizationBindings } from '../keys';
const DEFAULT_SCOPE = 'execute';

export class CasbinAuthorizationProvider implements Provider<CasbinAuthorizeFn> {
  constructor(
    @inject.getter(AuthorizationBindings.CASBIN_METADATA)
    private readonly getCasbinMetadata: Getter<CasbinAuthorizationMetadata>,
    private readonly invocationCtx: InvocationContext
  ) { }

  value(): CasbinAuthorizeFn {
    return (response, req) => this.action(response, req);
  }

  async action(enforcer: casbin.Enforcer, userId: string): Promise<boolean> {

    // await enforcer.loadPolicy();

    const metadata: CasbinAuthorizationMetadata = await this.getCasbinMetadata();

    console.log(this.invocationCtx);

    const subject = this.getUserName(userId);

    const object = metadata.resource;

    const action = metadata.scopes && metadata.scopes.length > 0 ? metadata.scopes[0] : DEFAULT_SCOPE;

    const request = {
      subject,
      object,
      action,
    };

    const allowedRoles = metadata.allowedRoles;

    if (!allowedRoles) return true;
    if (allowedRoles.length < 1) return false;

    const allowedByRole = await enforcer.enforce(
      request.subject,
      request.object,
      request.action,
    );

    return allowedByRole;
  }

  // Generate the user name according to the naming convention
  // in casbin policy
  // A user's name would be `u${id}`
  getUserName(id: string): string {
    return `u${id}`;
  }
}
