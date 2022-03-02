/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  expect,
  ShotRequestOptions,
  sinon,
  stubExpressContext,
} from '@loopback/testlab';
import {Request} from 'express';
import {AuthorizeActionProvider} from '../../providers';
import {AuthorizationMetadata} from '../../types';
import {mockUser} from './data/mock-user';

const mockPermissions: AuthorizationMetadata = {
  permissions: ['ViewTodo'],
};

describe('AuthorizeActionProvider', () => {
  it('should return true if user has required permissions', async () => {
    const metadataGetterStub = sinon.stub().resolves(mockPermissions);
    const action = new AuthorizeActionProvider(metadataGetterStub, []).value();
    const result = await action(mockUser.permissions);
    expect(result).to.be.true();
  });
  it('should return true for all users if resource has "*" as the first permissions', async () => {
    const metadataGetterStub = sinon.stub().resolves({permissions: ['*']});
    const action = new AuthorizeActionProvider(metadataGetterStub, []).value();
    const result = await action([]);
    expect(result).to.be.true();
  });
  it('should return false if user does not have required permissions', async () => {
    const metadataGetterStub = sinon.stub().resolves(mockPermissions);
    const action = new AuthorizeActionProvider(metadataGetterStub, []).value();
    const result = await action([]);
    expect(result).to.be.false();
  });
  it('should return true if requested resource is in always allowed list', async () => {
    const metadataGetterStub = sinon.stub().resolves(mockPermissions);
    const action = new AuthorizeActionProvider(metadataGetterStub, [
      '/always/allowed',
    ]).value();
    const mockRequest = givenRequest({
      url: '/always/allowed',
      payload: {},
    });
    const result = await action([], mockRequest);
    expect(result).to.be.true();
  });
  it('should return true if requested resource has a parent path in always allowed list', async () => {
    const metadataGetterStub = sinon.stub().resolves(mockPermissions);
    const action = new AuthorizeActionProvider(metadataGetterStub, [
      '/always/allowed',
    ]).value();
    const mockRequest = givenRequest({
      url: '/always/allowed/child',
      payload: {},
    });
    const result = await action([], mockRequest);
    expect(result).to.be.true();
  });
  it('should return false if requested resource is not in always allowed list, and user does not have required permissions', async () => {
    const metadataGetterStub = sinon.stub().resolves(mockPermissions);
    const action = new AuthorizeActionProvider(metadataGetterStub, [
      '/not/always/allowed',
    ]).value();
    const mockRequest = givenRequest({
      url: '/always/allowed',
      payload: {},
    });
    const result = await action([], mockRequest);
    expect(result).to.be.false();
  });
  it('should return false if resource has no attached metadata', async () => {
    const metadataGetterStub = sinon.stub().resolves();
    const action = new AuthorizeActionProvider(metadataGetterStub, []).value();
    const result = await action(mockUser.permissions);
    expect(result).to.be.false();
  });

  function givenRequest(options?: ShotRequestOptions): Request {
    return stubExpressContext(options).request;
  }
});
