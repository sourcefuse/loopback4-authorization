import {Provider} from '@loopback/context';

import {CasbinEnforcerConfigGetterFn} from '../types';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {HttpErrors} from '@loopback/rest';

export class CasbinEnforcerProvider
  implements Provider<CasbinEnforcerConfigGetterFn> {
  constructor() {}

  value(): CasbinEnforcerConfigGetterFn {
    return async (
      authUser: IAuthUserWithPermissions,
      resource: string,
      isCasbinPolicy?: boolean,
    ) => {
      throw new HttpErrors.NotImplemented(
        `CasbinEnforcerConfigGetterFn Provider is not implemented`,
      );
    };
  }
}
