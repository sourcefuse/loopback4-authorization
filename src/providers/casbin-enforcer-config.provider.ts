import {Provider} from '@loopback/context';

import {CasbinEnforcerConfigGetterFn, IAuthUserWithPermissions} from '../types';
import {HttpErrors} from '@loopback/rest';

export class CasbinEnforcerProvider
  implements Provider<CasbinEnforcerConfigGetterFn>
{
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
