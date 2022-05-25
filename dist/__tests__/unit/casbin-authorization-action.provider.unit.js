"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const casbin = tslib_1.__importStar(require("casbin"));
const casbin_1 = require("casbin");
const providers_1 = require("../../providers");
const data_1 = require("./data");
const mock_model_1 = require("./data/mock-model");
const mock_policy_1 = require("./data/mock-policy");
const mock_user_1 = require("./data/mock-user");
describe('CasbinAuthorizeActionProvider', () => {
    describe('With CasbinPolicy true', () => {
        it('should return true if user is authorized according to the policy', async () => {
            const configGetter = testlab_1.sinon.stub().resolves(Promise.resolve({
                model: casbin.newModelFromString(mock_model_1.model),
                policy: new casbin_1.StringAdapter(mock_policy_1.policy),
            }));
            const casbinMetadataGetter = testlab_1.sinon.stub().resolves({
                permissions: [data_1.PermissionKeys.ViewTODO],
                resource: 'todo',
                isCasbinPolicy: true,
            });
            const action = new providers_1.CasbinAuthorizationProvider(casbinMetadataGetter, configGetter, []).value();
            const mockRequest = givenRequest({
                url: '/',
            });
            const decision = await action(mock_user_1.mockUser, 'todo', mockRequest);
            (0, testlab_1.expect)(decision).to.be.true();
        });
        it('should return false if user is not authorized according to the policy', async () => {
            const configGetter = testlab_1.sinon.stub().resolves(Promise.resolve({
                model: casbin.newModelFromString(mock_model_1.model),
                policy: new casbin_1.StringAdapter(mock_policy_1.policy),
            }));
            const casbinMetadataGetter = testlab_1.sinon.stub().resolves({
                permissions: [data_1.PermissionKeys.UpdateTODO],
                resource: 'todo',
                isCasbinPolicy: true,
            });
            const action = new providers_1.CasbinAuthorizationProvider(casbinMetadataGetter, configGetter, []).value();
            const mockRequest = givenRequest({
                url: '/',
            });
            const decision = await action(mock_user_1.mockUser, 'todo', mockRequest);
            (0, testlab_1.expect)(decision).to.be.false();
        });
        it('should return true if the resource is always allowed, even if user does not have any permissions', async () => {
            const configGetter = testlab_1.sinon.stub().resolves(Promise.resolve({
                model: casbin.newModelFromString(mock_model_1.model),
                policy: new casbin_1.StringAdapter(mock_policy_1.policy),
            }));
            const casbinMetadataGetter = testlab_1.sinon.stub().resolves({
                permissions: [data_1.PermissionKeys.UpdateTODO],
                resource: 'todo',
                isCasbinPolicy: true,
            });
            const action = new providers_1.CasbinAuthorizationProvider(casbinMetadataGetter, configGetter, ['/always/allowed']).value();
            const mockRequest = givenRequest({
                url: '/always/allowed',
            });
            const decision = await action(mock_user_1.mockUser, 'todo', mockRequest);
            (0, testlab_1.expect)(decision).to.be.true();
        });
        it('should return true if the resource is always allowed, even if resource has no authorization metadata', async () => {
            const configGetter = testlab_1.sinon.stub().resolves(Promise.resolve({
                model: casbin.newModelFromString(mock_model_1.model),
                policy: new casbin_1.StringAdapter(mock_policy_1.policy),
            }));
            const casbinMetadataGetter = testlab_1.sinon.stub().resolves();
            const action = new providers_1.CasbinAuthorizationProvider(casbinMetadataGetter, configGetter, ['/always/allowed']).value();
            const mockRequest = givenRequest({
                url: '/always/allowed',
            });
            const decision = await action(mock_user_1.mockUser, 'todo', mockRequest);
            (0, testlab_1.expect)(decision).to.be.true();
        });
        it('should return false for a resource with no metadata', async () => {
            const configGetter = testlab_1.sinon.stub().resolves(Promise.resolve({
                model: casbin.newModelFromString(mock_model_1.model),
                policy: new casbin_1.StringAdapter(mock_policy_1.policy),
            }));
            const casbinMetadataGetter = testlab_1.sinon.stub().resolves();
            const action = new providers_1.CasbinAuthorizationProvider(casbinMetadataGetter, configGetter, []).value();
            const mockRequest = givenRequest({
                url: '/',
            });
            const decision = await action(mock_user_1.mockUser, 'todo', mockRequest);
            (0, testlab_1.expect)(decision).to.be.false();
        });
        it('should return true for a resource with "*" as first permission, even when user does not have necessary permissions', async () => {
            const configGetter = testlab_1.sinon.stub().resolves(Promise.resolve({
                model: casbin.newModelFromString(mock_model_1.model),
                policy: new casbin_1.StringAdapter(mock_policy_1.policy),
            }));
            const casbinMetadataGetter = testlab_1.sinon.stub().resolves({
                permissions: ['*'],
                resource: 'todo',
                isCasbinPolicy: true,
            });
            const action = new providers_1.CasbinAuthorizationProvider(casbinMetadataGetter, configGetter, []).value();
            const mockRequest = givenRequest({
                url: '/',
            });
            const decision = await action(mock_user_1.mockUser, 'todo', mockRequest);
            (0, testlab_1.expect)(decision).to.be.true();
        });
        it('should throw an error if resource parameter is missing in authorization metadata', async () => {
            const configGetter = testlab_1.sinon.stub().resolves(Promise.resolve({
                model: casbin.newModelFromString(mock_model_1.model),
                policy: new casbin_1.StringAdapter(mock_policy_1.policy),
            }));
            const casbinMetadataGetter = testlab_1.sinon.stub().resolves({
                permissions: [data_1.PermissionKeys.UpdateTODO],
                isCasbinPolicy: true,
            });
            const action = new providers_1.CasbinAuthorizationProvider(casbinMetadataGetter, configGetter, []).value();
            const mockRequest = givenRequest({
                url: '/',
            });
            const decision = action(mock_user_1.mockUser, 'todo', mockRequest);
            await (0, testlab_1.expect)(decision).to.be.rejectedWith(`Resource parameter is missing in the decorator.`);
        });
        it('should throw an error if permissions parameter is missing in authorization metadata', async () => {
            const configGetter = testlab_1.sinon.stub().resolves(Promise.resolve({
                model: casbin.newModelFromString(mock_model_1.model),
                policy: new casbin_1.StringAdapter(mock_policy_1.policy),
            }));
            const casbinMetadataGetter = testlab_1.sinon.stub().resolves({
                resource: 'todo',
                isCasbinPolicy: true,
            });
            const action = new providers_1.CasbinAuthorizationProvider(casbinMetadataGetter, configGetter, []).value();
            const mockRequest = givenRequest({
                url: '/',
            });
            const decision = action(mock_user_1.mockUser, 'todo', mockRequest);
            await (0, testlab_1.expect)(decision).to.be.rejectedWith(`Permissions are missing in the decorator.`);
        });
        it('should throw an error if user id is missing', async () => {
            const configGetter = testlab_1.sinon.stub().resolves(Promise.resolve({
                model: casbin.newModelFromString(mock_model_1.model),
                policy: new casbin_1.StringAdapter(mock_policy_1.policy),
            }));
            const casbinMetadataGetter = testlab_1.sinon.stub().resolves({
                permissions: [data_1.PermissionKeys.UpdateTODO],
                resource: 'todo',
                isCasbinPolicy: true,
            });
            const action = new providers_1.CasbinAuthorizationProvider(casbinMetadataGetter, configGetter, []).value();
            const mockRequest = givenRequest({
                url: '/',
            });
            const decision = action({
                ...mock_user_1.mockUser,
                id: undefined,
            }, 'todo', mockRequest);
            await (0, testlab_1.expect)(decision).to.be.rejectedWith(`User not found.`);
        });
    });
    describe('With Casbin Policy false', () => {
        it('should return true if user is authorized according to the policy', async () => {
            const configGetter = testlab_1.sinon.stub().resolves(Promise.resolve({
                model: casbin.newModelFromString(mock_model_1.model),
                allowedRes: [{ resource: 'todo', permission: 'ViewTodo' }],
            }));
            const casbinMetadataGetter = testlab_1.sinon.stub().resolves({
                permissions: [data_1.PermissionKeys.ViewTODO],
                resource: 'todo',
                isCasbinPolicy: false,
            });
            const action = new providers_1.CasbinAuthorizationProvider(casbinMetadataGetter, configGetter, []).value();
            const mockRequest = givenRequest({
                url: '/',
            });
            const decision = await action(mock_user_1.mockUser, 'todo', mockRequest);
            (0, testlab_1.expect)(decision).to.be.true();
        });
        it('should return false if user is not authorized according to the policy', async () => {
            const configGetter = testlab_1.sinon.stub().resolves(Promise.resolve({
                model: casbin.newModelFromString(mock_model_1.model),
                allowedRes: [{ resource: 'todo', permission: 'ViewTodo' }],
            }));
            const casbinMetadataGetter = testlab_1.sinon.stub().resolves({
                permissions: [data_1.PermissionKeys.UpdateTODO],
                resource: 'todo',
                isCasbinPolicy: false,
            });
            const action = new providers_1.CasbinAuthorizationProvider(casbinMetadataGetter, configGetter, []).value();
            const mockRequest = givenRequest({
                url: '/',
            });
            const decision = await action(mock_user_1.mockUser, 'todo', mockRequest);
            (0, testlab_1.expect)(decision).to.be.false();
        });
    });
    function givenRequest(options) {
        return (0, testlab_1.stubExpressContext)(options).request;
    }
});
//# sourceMappingURL=casbin-authorization-action.provider.unit.js.map