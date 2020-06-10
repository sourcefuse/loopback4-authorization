import {CustomAuthorizeFn} from '../types';
import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';

/**
 * A provider for custom permissions
 *
 * It will just throw an error saying Not Implemented
 */
export class CustomAuthorizeActionProvider
  implements Provider<CustomAuthorizeFn> {
  constructor() {}

  value(): CustomAuthorizeFn {
    return async (userPermissions, request) => {
      throw new HttpErrors.NotImplemented(
        `CustomAuthorizeFn is not implemented`,
      );
    };
  }
}
