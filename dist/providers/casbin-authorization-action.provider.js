"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinAuthorizationProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const casbin = tslib_1.__importStar(require("casbin"));
const keys_1 = require("../keys");
let CasbinAuthorizationProvider = class CasbinAuthorizationProvider {
    constructor(getCasbinMetadata, getCasbinEnforcerConfig, allowAlwaysPath) {
        this.getCasbinMetadata = getCasbinMetadata;
        this.getCasbinEnforcerConfig = getCasbinEnforcerConfig;
        this.allowAlwaysPath = allowAlwaysPath;
    }
    value() {
        return (response, resource, request) => this.action(response, resource, request);
    }
    async action(user, resource, request) {
        var _a;
        let authDecision = false;
        try {
            // fetch decorator metadata
            const metadata = await this.getCasbinMetadata();
            if (request && this.checkIfAllowedAlways(request)) {
                return true;
            }
            else if (!metadata) {
                return false;
            }
            else if (((_a = metadata.permissions) === null || _a === void 0 ? void 0 : _a.indexOf('*')) === 0) {
                // Return immediately with true, if allowed to all
                // This is for publicly open routes only
                return true;
            }
            else if (!metadata.resource) {
                throw new rest_1.HttpErrors.Unauthorized(`Resource parameter is missing in the decorator.`);
            }
            if (!user.id) {
                throw new rest_1.HttpErrors.Unauthorized(`User not found.`);
            }
            const subject = this.getUserName(`${user.id}`);
            let desiredPermissions;
            if (metadata.permissions && metadata.permissions.length > 0) {
                desiredPermissions = metadata.permissions;
            }
            else {
                throw new rest_1.HttpErrors.Unauthorized(`Permissions are missing in the decorator.`);
            }
            // Fetch casbin config by invoking casbin-config-getter-provider
            const casbinConfig = await this.getCasbinEnforcerConfig(user, metadata.resource, metadata.isCasbinPolicy);
            let enforcer;
            // If casbin config policy format is being used, create enforcer
            if (metadata.isCasbinPolicy) {
                enforcer = await casbin.newEnforcer(casbinConfig.model, casbinConfig.policy);
            }
            // In case casbin policy is coming via provider, use that to initialise enforcer
            else if (!metadata.isCasbinPolicy && casbinConfig.allowedRes) {
                const policy = this.createCasbinPolicy(casbinConfig.allowedRes, subject);
                const stringAdapter = new casbin.StringAdapter(policy);
                enforcer = new casbin.Enforcer();
                await enforcer.initWithModelAndAdapter(casbinConfig.model, stringAdapter);
            }
            else {
                return false;
            }
            // Use casbin enforce method to get authorization decision
            for (const permission of desiredPermissions) {
                const decision = await enforcer.enforce(subject, resource, permission);
                authDecision = authDecision || decision;
            }
        }
        catch (err) {
            throw new rest_1.HttpErrors.Unauthorized(err.message);
        }
        return authDecision;
    }
    // Generate the user name according to the naming convention
    // in casbin policy
    // A user's name would be `u${ id }`
    getUserName(id) {
        return `u${id}`;
    }
    // Create casbin policy for user based on ResourcePermission data provided by extension client
    createCasbinPolicy(resPermObj, subject) {
        let result = '';
        resPermObj.forEach(resPerm => {
            const policy = `p, ${subject}, ${resPerm.resource}, ${resPerm.permission}
        `;
            result += policy;
        });
        return result;
    }
    checkIfAllowedAlways(req) {
        let allowed = false;
        allowed = !!this.allowAlwaysPath.find(path => req.path.indexOf(path) === 0);
        return allowed;
    }
};
CasbinAuthorizationProvider = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject.getter(keys_1.AuthorizationBindings.METADATA)),
    tslib_1.__param(1, (0, core_1.inject)(keys_1.AuthorizationBindings.CASBIN_ENFORCER_CONFIG_GETTER)),
    tslib_1.__param(2, (0, core_1.inject)(keys_1.AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS)),
    tslib_1.__metadata("design:paramtypes", [Function, Function, Array])
], CasbinAuthorizationProvider);
exports.CasbinAuthorizationProvider = CasbinAuthorizationProvider;
//# sourceMappingURL=casbin-authorization-action.provider.js.map