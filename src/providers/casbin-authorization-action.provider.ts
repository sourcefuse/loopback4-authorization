import {Getter, inject, Provider} from '@loopback/core';
import {Request} from '@loopback/express';
import {HttpErrors} from '@loopback/rest';
import * as casbin from 'casbin';

import {AuthorizationBindings} from '../keys';
import {
  AuthorizationMetadata,
  CasbinAuthorizeFn,
  CasbinEnforcerConfigGetterFn,
  IAuthUserWithPermissions,
  ResourcePermissionObject,
} from '../types';

export class CasbinAuthorizationProvider
  implements Provider<CasbinAuthorizeFn>
{
  constructor(
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getCasbinMetadata: Getter<AuthorizationMetadata>,
    @inject(AuthorizationBindings.CASBIN_ENFORCER_CONFIG_GETTER)
    private readonly getCasbinEnforcerConfig: CasbinEnforcerConfigGetterFn,
    @inject(AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS)
    private readonly allowAlwaysPath: string[],
  ) {}

  value(): CasbinAuthorizeFn {
    return (response, resource, request) =>
      this.action(response, resource, request);
  }

  async action(
    user: IAuthUserWithPermissions,
    resource: string,
    request?: Request,
  ): Promise<boolean> {
    let authDecision = false;
    try {
      // fetch decorator metadata
      const metadata: AuthorizationMetadata = await this.getCasbinMetadata();

      if (request && this.checkIfAllowedAlways(request)) {
        return true;
      } else if (!metadata) {
        return false;
      } else if (metadata.permissions?.indexOf('*') === 0) {
        // Return immediately with true, if allowed to all
        // This is for publicly open routes only
        return true;
      } else if (!metadata.resource) {
        throw new HttpErrors.Unauthorized(
          `Resource parameter is missing in the decorator.`,
        );
      }

      if (!user.id) {
        throw new HttpErrors.Unauthorized(`User not found.`);
      }

      const subject = this.getUserName(`${user.id}`);

      let desiredPermissions;

      if (metadata.permissions && metadata.permissions.length > 0) {
        desiredPermissions = metadata.permissions;
      } else {
        throw new HttpErrors.Unauthorized(
          `Permissions are missing in the decorator.`,
        );
      }

      // Fetch casbin config by invoking casbin-config-getter-provider
      const casbinConfig = await this.getCasbinEnforcerConfig(
        user,
        metadata.resource,
        metadata.isCasbinPolicy,
      );

      let enforcer: casbin.Enforcer;

      // If casbin config policy format is being used, create enforcer
      if (metadata.isCasbinPolicy) {
        enforcer = await casbin.newEnforcer(
          casbinConfig.model,
          casbinConfig.policy,
        );
      }
      // In case casbin policy is coming via provider, use that to initialise enforcer
      else if (!metadata.isCasbinPolicy && casbinConfig.allowedRes) {
        const policy = this.createCasbinPolicy(
          casbinConfig.allowedRes,
          subject,
        );
        const stringAdapter = new casbin.StringAdapter(policy);
        enforcer = new casbin.Enforcer();
        await enforcer.initWithModelAndAdapter(
          casbinConfig.model as casbin.Model,
          stringAdapter,
        );
      } else {
        return false;
      }

      // Use casbin enforce method to get authorization decision
      for (const permission of desiredPermissions) {
        const decision = await enforcer.enforce(subject, resource, permission);
        authDecision = authDecision || decision;
      }
    } catch (err) {
      throw new HttpErrors.Unauthorized(err.message);
    }

    return authDecision;
  }

  // Generate the user name according to the naming convention
  // in casbin policy
  // A user's name would be `u${ id }`
  getUserName(id: string): string {
    return `u${id}`;
  }

  // Create casbin policy for user based on ResourcePermission data provided by extension client
  createCasbinPolicy(
    resPermObj: ResourcePermissionObject[],
    subject: string,
  ): string {
    let result = '';
    resPermObj.forEach(resPerm => {
      const policy = `p, ${subject}, ${resPerm.resource}, ${resPerm.permission}
        `;
      result += policy;
    });

    return result;
  }

  checkIfAllowedAlways(req: Request): boolean {
    let allowed = false;
    allowed = !!this.allowAlwaysPath.find(path => req.path.indexOf(path) === 0);
    return allowed;
  }
}
