import {Getter, inject, Provider} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import * as casbin from 'casbin';
import * as fs from 'fs';
import * as path from 'path';
import {AuthorizationBindings} from '../keys';
import {
  AuthorizationMetadata,
  CasbinAuthorizeFn,
  CasbinEnforcerConfigGetterFn,
} from '../types';
const fsPromises = fs.promises;

const DEFAULT_SCOPE = 'execute';

export class CasbinAuthorizationProvider
  implements Provider<CasbinAuthorizeFn> {
  constructor(
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getCasbinMetadata: Getter<AuthorizationMetadata>,
    @inject.getter(AuthorizationBindings.CASBIN_ENFORCER_CONFIG_GETTER)
    private readonly getCasbinEnforcerConfig: Getter<
      CasbinEnforcerConfigGetterFn
    >,
  ) {}

  value(): CasbinAuthorizeFn {
    return (response, resource) => this.action(response, resource);
  }

  async action(
    user: IAuthUserWithPermissions,
    resource: string,
  ): Promise<boolean> {
    let authDecision = false;
    try {
      // fetch decorator metadata
      const metadata: AuthorizationMetadata = await this.getCasbinMetadata();

      if (!metadata.resource) {
        return false;
      }

      const subject = this.getUserName(`${user.id}`);

      const object = resource;

      const action =
        metadata.permissions && metadata.permissions.length > 0
          ? metadata.permissions[0]
          : DEFAULT_SCOPE;

      // Fetch casbin config by invoking casbin-config-getter-provider
      const fn = await this.getCasbinEnforcerConfig();

      const casbinConfig = await fn(user, metadata.resource);

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
          action,
        );
        const baseDir = path.join(__dirname, '../../src/policy.csv');
        await fsPromises.writeFile(baseDir, policy);

        enforcer = await casbin.newEnforcer(casbinConfig.model, baseDir);
      } else {
        return false;
      }

      authDecision = await enforcer.enforce(subject, object, action);
    } catch (err) {
      console.log(err);
    }

    return authDecision;
  }

  // Generate the user name according to the naming convention
  // in casbin policy
  // A user's name would be `u${ id }`
  getUserName(id: string): string {
    return `u${id}`;
  }

  createCasbinPolicy(
    allowedRes: string[],
    subject: string,
    action: string,
  ): string {
    //Expected format for allowedRes: ['ping', 'ping2', 'ping3'];

    let result = '';
    allowedRes.forEach(res => {
      const policy = `p, ${subject}, ${res}, ${action}
      `;
      result += policy;
    });

    return result;
  }
}
