import {AuthorizationMetadata} from '../../types';
import {
  expect,
  ShotRequestOptions,
  sinon,
  stubExpressContext,
} from '@loopback/testlab';
import {Request} from 'express';
import {AuthorizeActionProvider} from '../../providers';
import {mockUser} from './data/mock-user';
import {Context} from '@loopback/core';

const mockPermissions: AuthorizationMetadata = {
  permissions: ['ViewTodo'],
};

describe('AuthorizeActionProvider', () => {
  it('should return true if user has required permissions', async () => {
    const metadataGetterStub = sinon.stub().resolves(mockPermissions);
    const action = new AuthorizeActionProvider(
      metadataGetterStub,
      [],
      getRequestContext(),
    ).value();
    const result = await action(mockUser.permissions);
    expect(result).to.be.true();
  });
  it('should return true for all users if resource has "*" as the first permissions', async () => {
    const metadataGetterStub = sinon.stub().resolves({permissions: ['*']});
    const action = new AuthorizeActionProvider(
      metadataGetterStub,
      [],
      getRequestContext(),
    ).value();
    const result = await action([]);
    expect(result).to.be.true();
  });
  it('should return false if user does not have required permissions', async () => {
    const metadataGetterStub = sinon.stub().resolves(mockPermissions);
    const action = new AuthorizeActionProvider(
      metadataGetterStub,
      [],
      getRequestContext(),
    ).value();
    const result = await action([]);
    expect(result).to.be.false();
  });
  it('should return true if requested resource is in always allowed list', async () => {
    const metadataGetterStub = sinon.stub().resolves(mockPermissions);
    const action = new AuthorizeActionProvider(
      metadataGetterStub,
      ['/always/allowed'],
      getRequestContext(),
    ).value();
    const mockRequest = givenRequest({
      url: '/always/allowed',
      payload: {},
    });
    const result = await action([], mockRequest);
    expect(result).to.be.true();
  });
  it('should return true if requested resource has a parent path in always allowed list', async () => {
    const metadataGetterStub = sinon.stub().resolves(mockPermissions);
    const action = new AuthorizeActionProvider(
      metadataGetterStub,
      ['/always/allowed'],
      getRequestContext(),
    ).value();
    const mockRequest = givenRequest({
      url: '/always/allowed/child',
      payload: {},
    });
    const result = await action([], mockRequest);
    expect(result).to.be.true();
  });
  it('should return false if requested resource is not in always allowed list, and user does not have required permissions', async () => {
    const metadataGetterStub = sinon.stub().resolves(mockPermissions);
    const action = new AuthorizeActionProvider(
      metadataGetterStub,
      ['/not/always/allowed'],
      getRequestContext(),
    ).value();
    const mockRequest = givenRequest({
      url: '/always/allowed',
      payload: {},
    });
    const result = await action([], mockRequest);
    expect(result).to.be.false();
  });
  it('should return false if resource has no attached metadata', async () => {
    const requestContext = getRequestContext();
    requestContext.get.resolves('');

    const metadataGetterStub = sinon.stub().resolves();
    const action = new AuthorizeActionProvider(
      metadataGetterStub,
      [],
      requestContext,
    ).value();
    const result = await action(mockUser.permissions);
    expect(result).to.be.false();
  });

  it('should throw 404 if non existing route is hit', async () => {
    const requestContext = getRequestContext();
    requestContext.get.throws();
    const metadataGetterStub = sinon.stub().resolves();
    const action = new AuthorizeActionProvider(
      metadataGetterStub,
      [],
      requestContext,
    ).value();
    const result = await action(mockUser.permissions).catch(err => err);
    expect(result).be.instanceOf(Error);
    expect(result).to.have.property('message').which.eql('Not Found');
  });
  function givenRequest(options?: ShotRequestOptions): Request {
    return stubExpressContext(options).request;
  }
  function getRequestContext(): sinon.SinonStubbedInstance<Context> {
    return sinon.createStubInstance(Context);
  }
});
