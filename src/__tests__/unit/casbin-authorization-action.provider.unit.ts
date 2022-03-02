/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  expect,
  ShotRequestOptions,
  sinon,
  stubExpressContext,
} from '@loopback/testlab';
import * as casbin from 'casbin';
import {StringAdapter} from 'casbin';
import {Request} from 'express';
import {CasbinAuthorizationProvider} from '../../providers';
import {PermissionKeys} from './data';
import {model} from './data/mock-model';
import {policy} from './data/mock-policy';
import {mockUser} from './data/mock-user';

describe('CasbinAuthorizeActionProvider', () => {
  describe('With CasbinPolicy true', () => {
    it('should return true if user is authorized according to the policy', async () => {
      const configGetter = sinon.stub().resolves(
        Promise.resolve({
          model: casbin.newModelFromString(model),
          policy: new StringAdapter(policy),
        }),
      );
      const casbinMetadataGetter = sinon.stub().resolves({
        permissions: [PermissionKeys.ViewTODO],
        resource: 'todo',
        isCasbinPolicy: true,
      });
      const action = new CasbinAuthorizationProvider(
        casbinMetadataGetter,
        configGetter,
        [],
      ).value();

      const mockRequest = givenRequest({
        url: '/',
      });
      const decision = await action(mockUser, 'todo', mockRequest);
      expect(decision).to.be.true();
    });

    it('should return false if user is not authorized according to the policy', async () => {
      const configGetter = sinon.stub().resolves(
        Promise.resolve({
          model: casbin.newModelFromString(model),
          policy: new StringAdapter(policy),
        }),
      );
      const casbinMetadataGetter = sinon.stub().resolves({
        permissions: [PermissionKeys.UpdateTODO],
        resource: 'todo',
        isCasbinPolicy: true,
      });
      const action = new CasbinAuthorizationProvider(
        casbinMetadataGetter,
        configGetter,
        [],
      ).value();

      const mockRequest = givenRequest({
        url: '/',
      });
      const decision = await action(mockUser, 'todo', mockRequest);
      expect(decision).to.be.false();
    });

    it('should return true if the resource is always allowed, even if user does not have any permissions', async () => {
      const configGetter = sinon.stub().resolves(
        Promise.resolve({
          model: casbin.newModelFromString(model),
          policy: new StringAdapter(policy),
        }),
      );
      const casbinMetadataGetter = sinon.stub().resolves({
        permissions: [PermissionKeys.UpdateTODO],
        resource: 'todo',
        isCasbinPolicy: true,
      });
      const action = new CasbinAuthorizationProvider(
        casbinMetadataGetter,
        configGetter,
        ['/always/allowed'],
      ).value();

      const mockRequest = givenRequest({
        url: '/always/allowed',
      });
      const decision = await action(mockUser, 'todo', mockRequest);
      expect(decision).to.be.true();
    });

    it('should return true if the resource is always allowed, even if resource has no authorization metadata', async () => {
      const configGetter = sinon.stub().resolves(
        Promise.resolve({
          model: casbin.newModelFromString(model),
          policy: new StringAdapter(policy),
        }),
      );
      const casbinMetadataGetter = sinon.stub().resolves();
      const action = new CasbinAuthorizationProvider(
        casbinMetadataGetter,
        configGetter,
        ['/always/allowed'],
      ).value();

      const mockRequest = givenRequest({
        url: '/always/allowed',
      });
      const decision = await action(mockUser, 'todo', mockRequest);
      expect(decision).to.be.true();
    });

    it('should return false for a resource with no metadata', async () => {
      const configGetter = sinon.stub().resolves(
        Promise.resolve({
          model: casbin.newModelFromString(model),
          policy: new StringAdapter(policy),
        }),
      );
      const casbinMetadataGetter = sinon.stub().resolves();
      const action = new CasbinAuthorizationProvider(
        casbinMetadataGetter,
        configGetter,
        [],
      ).value();

      const mockRequest = givenRequest({
        url: '/',
      });
      const decision = await action(mockUser, 'todo', mockRequest);
      expect(decision).to.be.false();
    });

    it('should return true for a resource with "*" as first permission, even when user does not have necessary permissions', async () => {
      const configGetter = sinon.stub().resolves(
        Promise.resolve({
          model: casbin.newModelFromString(model),
          policy: new StringAdapter(policy),
        }),
      );
      const casbinMetadataGetter = sinon.stub().resolves({
        permissions: ['*'],
        resource: 'todo',
        isCasbinPolicy: true,
      });
      const action = new CasbinAuthorizationProvider(
        casbinMetadataGetter,
        configGetter,
        [],
      ).value();

      const mockRequest = givenRequest({
        url: '/',
      });
      const decision = await action(mockUser, 'todo', mockRequest);
      expect(decision).to.be.true();
    });

    it('should throw an error if resource parameter is missing in authorization metadata', async () => {
      const configGetter = sinon.stub().resolves(
        Promise.resolve({
          model: casbin.newModelFromString(model),
          policy: new StringAdapter(policy),
        }),
      );
      const casbinMetadataGetter = sinon.stub().resolves({
        permissions: [PermissionKeys.UpdateTODO],
        isCasbinPolicy: true,
      });
      const action = new CasbinAuthorizationProvider(
        casbinMetadataGetter,
        configGetter,
        [],
      ).value();

      const mockRequest = givenRequest({
        url: '/',
      });
      const decision = action(mockUser, 'todo', mockRequest);

      await expect(decision).to.be.rejectedWith(
        `Resource parameter is missing in the decorator.`,
      );
    });

    it('should throw an error if permissions parameter is missing in authorization metadata', async () => {
      const configGetter = sinon.stub().resolves(
        Promise.resolve({
          model: casbin.newModelFromString(model),
          policy: new StringAdapter(policy),
        }),
      );
      const casbinMetadataGetter = sinon.stub().resolves({
        resource: 'todo',
        isCasbinPolicy: true,
      });
      const action = new CasbinAuthorizationProvider(
        casbinMetadataGetter,
        configGetter,
        [],
      ).value();

      const mockRequest = givenRequest({
        url: '/',
      });
      const decision = action(mockUser, 'todo', mockRequest);

      await expect(decision).to.be.rejectedWith(
        `Permissions are missing in the decorator.`,
      );
    });

    it('should throw an error if user id is missing', async () => {
      const configGetter = sinon.stub().resolves(
        Promise.resolve({
          model: casbin.newModelFromString(model),
          policy: new StringAdapter(policy),
        }),
      );
      const casbinMetadataGetter = sinon.stub().resolves({
        permissions: [PermissionKeys.UpdateTODO],
        resource: 'todo',
        isCasbinPolicy: true,
      });
      const action = new CasbinAuthorizationProvider(
        casbinMetadataGetter,
        configGetter,
        [],
      ).value();

      const mockRequest = givenRequest({
        url: '/',
      });
      const decision = action(
        {
          ...mockUser,
          id: undefined,
        },
        'todo',
        mockRequest,
      );

      await expect(decision).to.be.rejectedWith(`User not found.`);
    });
  });

  describe('With Casbin Policy false', () => {
    it('should return true if user is authorized according to the policy', async () => {
      const configGetter = sinon.stub().resolves(
        Promise.resolve({
          model: casbin.newModelFromString(model),
          allowedRes: [{resource: 'todo', permission: 'ViewTodo'}],
        }),
      );

      const casbinMetadataGetter = sinon.stub().resolves({
        permissions: [PermissionKeys.ViewTODO],
        resource: 'todo',
        isCasbinPolicy: false,
      });
      const action = new CasbinAuthorizationProvider(
        casbinMetadataGetter,
        configGetter,
        [],
      ).value();

      const mockRequest = givenRequest({
        url: '/',
      });
      const decision = await action(mockUser, 'todo', mockRequest);
      expect(decision).to.be.true();
    });

    it('should return false if user is not authorized according to the policy', async () => {
      const configGetter = sinon.stub().resolves(
        Promise.resolve({
          model: casbin.newModelFromString(model),
          allowedRes: [{resource: 'todo', permission: 'ViewTodo'}],
        }),
      );

      const casbinMetadataGetter = sinon.stub().resolves({
        permissions: [PermissionKeys.UpdateTODO],
        resource: 'todo',
        isCasbinPolicy: false,
      });
      const action = new CasbinAuthorizationProvider(
        casbinMetadataGetter,
        configGetter,
        [],
      ).value();

      const mockRequest = givenRequest({
        url: '/',
      });
      const decision = await action(mockUser, 'todo', mockRequest);
      expect(decision).to.be.false();
    });
  });

  function givenRequest(options?: ShotRequestOptions): Request {
    return stubExpressContext(options).request;
  }
});
