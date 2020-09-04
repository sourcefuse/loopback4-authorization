import { Provider } from '@loopback/context';

import { CasbinEnforcerFn } from '../types';
import { HttpErrors } from '@loopback/rest';
import PostgresAdapter from 'casbin-pg-adapter';

export class CasbinEnforcerProvider
  implements Provider<CasbinEnforcerFn<string>> {
  constructor() { }

  value(): CasbinEnforcerFn<string> {
    return async (model: string, policy: string | PostgresAdapter) => {
      throw new HttpErrors.NotImplemented(
        `CasinEnforcerFn Provider is not implemented`,
      );
    };
  }
}
