import {Provider} from '@loopback/context';

import {HttpErrors} from '@loopback/rest';
import {CasbinEnforcerConfigGetterFn, IAuthUserWithPermissions} from '../types';

export class CasbinEnforcerProvider
  implements Provider<CasbinEnforcerConfigGetterFn>
{
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
