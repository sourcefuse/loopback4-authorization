"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const providers_1 = require("../../providers");
const mock_user_1 = require("./data/mock-user");
const core_1 = require("@loopback/core");
const mockPermissions = {
    permissions: ['ViewTodo'],
};
describe('AuthorizeActionProvider', () => {
    it('should return true if user has required permissions', async () => {
        const metadataGetterStub = testlab_1.sinon.stub().resolves(mockPermissions);
        const action = new providers_1.AuthorizeActionProvider(metadataGetterStub, [], getRequestContext()).value();
        const result = await action(mock_user_1.mockUser.permissions);
        (0, testlab_1.expect)(result).to.be.true();
    });
    it('should return true for all users if resource has "*" as the first permissions', async () => {
        const metadataGetterStub = testlab_1.sinon.stub().resolves({ permissions: ['*'] });
        const action = new providers_1.AuthorizeActionProvider(metadataGetterStub, [], getRequestContext()).value();
        const result = await action([]);
        (0, testlab_1.expect)(result).to.be.true();
    });
    it('should return false if user does not have required permissions', async () => {
        const metadataGetterStub = testlab_1.sinon.stub().resolves(mockPermissions);
        const action = new providers_1.AuthorizeActionProvider(metadataGetterStub, [], getRequestContext()).value();
        const result = await action([]);
        (0, testlab_1.expect)(result).to.be.false();
    });
    it('should return true if requested resource is in always allowed list', async () => {
        const metadataGetterStub = testlab_1.sinon.stub().resolves(mockPermissions);
        const action = new providers_1.AuthorizeActionProvider(metadataGetterStub, ['/always/allowed'], getRequestContext()).value();
        const mockRequest = givenRequest({
            url: '/always/allowed',
            payload: {},
        });
        const result = await action([], mockRequest);
        (0, testlab_1.expect)(result).to.be.true();
    });
    it('should return true if requested resource has a parent path in always allowed list', async () => {
        const metadataGetterStub = testlab_1.sinon.stub().resolves(mockPermissions);
        const action = new providers_1.AuthorizeActionProvider(metadataGetterStub, ['/always/allowed'], getRequestContext()).value();
        const mockRequest = givenRequest({
            url: '/always/allowed/child',
            payload: {},
        });
        const result = await action([], mockRequest);
        (0, testlab_1.expect)(result).to.be.true();
    });
    it('should return false if requested resource is not in always allowed list, and user does not have required permissions', async () => {
        const metadataGetterStub = testlab_1.sinon.stub().resolves(mockPermissions);
        const action = new providers_1.AuthorizeActionProvider(metadataGetterStub, ['/not/always/allowed'], getRequestContext()).value();
        const mockRequest = givenRequest({
            url: '/always/allowed',
            payload: {},
        });
        const result = await action([], mockRequest);
        (0, testlab_1.expect)(result).to.be.false();
    });
    it('should return false if resource has no attached metadata', async () => {
        const requestContext = getRequestContext();
        requestContext.get.resolves('');
        const metadataGetterStub = testlab_1.sinon.stub().resolves();
        const action = new providers_1.AuthorizeActionProvider(metadataGetterStub, [], requestContext).value();
        const result = await action(mock_user_1.mockUser.permissions);
        (0, testlab_1.expect)(result).to.be.false();
    });
    it('should throw 404 if non existing route is hit', async () => {
        const requestContext = getRequestContext();
        requestContext.get.throws();
        const metadataGetterStub = testlab_1.sinon.stub().resolves();
        const action = new providers_1.AuthorizeActionProvider(metadataGetterStub, [], requestContext).value();
        const result = await action(mock_user_1.mockUser.permissions).catch(err => err);
        (0, testlab_1.expect)(result).be.instanceOf(Error);
        (0, testlab_1.expect)(result).to.have.property('message').which.eql('API not found !');
    });
    function givenRequest(options) {
        return (0, testlab_1.stubExpressContext)(options).request;
    }
    function getRequestContext() {
        return testlab_1.sinon.createStubInstance(core_1.Context);
    }
});
//# sourceMappingURL=authorization-action.provider.unit.js.map