import {expect} from '@loopback/testlab';
import {getAuthorizeMetadata} from '../../providers';
import {AuthorizationMetadata, PermissionObject} from '../../types';
import {authorize} from '../../decorators';
import {get} from '@loopback/rest';

describe('getAuthorizeMetadata()', function () {
  it('should return the authorization metadata when userPermission is provided', () => {
    class TestController {
      @authorize({permissions: ['default1', 'default2']})
      @get('/')
      async testMethod() {
        // This is intentional.
      }
    }
    const methodName = 'testMethod';
    const mockUserPermission: PermissionObject = {
      TestController: {
        testMethod: ['permission1', 'permission2'],
      },
    };

    const authorizationMetadata = getAuthorizeMetadata(
      TestController,
      methodName,
      mockUserPermission,
    );
    expect(authorizationMetadata?.permissions).which.eql(
      mockUserPermission.TestController[methodName],
    );
  });

  it('should return permissions from metadata if userpermission is not provided', () => {
    class TestController {
      @authorize({permissions: ['default1', 'default2']})
      @get('/')
      async testMethod() {
        // This is intentional.
      }
    }
    const methodName = 'testMethod';
    const authorizationMetadata = getAuthorizeMetadata(
      TestController,
      methodName,
    );
    const expectedResult: AuthorizationMetadata = {
      permissions: ['default1', 'default2'],
    };
    expect(authorizationMetadata?.permissions).which.eql(
      expectedResult.permissions,
    );
  });
});
