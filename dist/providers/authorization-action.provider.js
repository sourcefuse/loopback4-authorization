"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeActionProvider = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const keys_1 = require("../keys");
const lodash_1 = require("lodash");
const rest_1 = require("@loopback/rest");
const core_1 = require("@loopback/core");
let AuthorizeActionProvider = class AuthorizeActionProvider {
    constructor(getMetadata, allowAlwaysPath, requestContext) {
        this.getMetadata = getMetadata;
        this.allowAlwaysPath = allowAlwaysPath;
        this.requestContext = requestContext;
    }
    value() {
        return (response, req) => this.action(response, req);
    }
    async action(userPermissions, request) {
        const metadata = await this.getMetadata();
        let methodName = '';
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            methodName = await this.requestContext.get(core_1.CoreBindings.CONTROLLER_METHOD_NAME);
        }
        catch (error) {
            throw new rest_1.HttpErrors.NotFound('API not found !');
        }
        if (request && this.checkIfAllowedAlways(request)) {
            return true;
        }
        else if (!metadata) {
            return false;
        }
        else if (metadata.permissions.indexOf('*') === 0) {
            // Return immediately with true, if allowed to all
            // This is for publicly open routes only
            return true;
        }
        const permissionsToCheck = metadata.permissions;
        return (0, lodash_1.intersection)(userPermissions, permissionsToCheck).length > 0;
    }
    checkIfAllowedAlways(req) {
        let allowed = false;
        allowed = !!this.allowAlwaysPath.find(path => req.path.indexOf(path) === 0);
        return allowed;
    }
};
AuthorizeActionProvider = tslib_1.__decorate([
    tslib_1.__param(0, context_1.inject.getter(keys_1.AuthorizationBindings.METADATA)),
    tslib_1.__param(1, (0, context_1.inject)(keys_1.AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS)),
    tslib_1.__param(2, (0, context_1.inject)(rest_1.RestBindings.Http.CONTEXT)),
    tslib_1.__metadata("design:paramtypes", [Function, Array, core_1.Context])
], AuthorizeActionProvider);
exports.AuthorizeActionProvider = AuthorizeActionProvider;
//# sourceMappingURL=authorization-action.provider.js.map