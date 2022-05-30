"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("./keys");
const authorization_action_provider_1 = require("./providers/authorization-action.provider");
const authorization_metadata_provider_1 = require("./providers/authorization-metadata.provider");
const casbin_authorization_action_provider_1 = require("./providers/casbin-authorization-action.provider");
const user_permissions_provider_1 = require("./providers/user-permissions.provider");
let AuthorizationComponent = class AuthorizationComponent {
    constructor(config) {
        var _a, _b, _c;
        this.config = config;
        this.providers = {
            [keys_1.AuthorizationBindings.AUTHORIZE_ACTION.key]: authorization_action_provider_1.AuthorizeActionProvider,
            [keys_1.AuthorizationBindings.CASBIN_AUTHORIZE_ACTION.key]: casbin_authorization_action_provider_1.CasbinAuthorizationProvider,
            [keys_1.AuthorizationBindings.METADATA.key]: authorization_metadata_provider_1.AuthorizationMetadataProvider,
            [keys_1.AuthorizationBindings.USER_PERMISSIONS.key]: user_permissions_provider_1.UserPermissionsProvider,
        };
        if (((_a = this.config) === null || _a === void 0 ? void 0 : _a.allowAlwaysPaths) &&
            ((_c = (_b = this.config) === null || _b === void 0 ? void 0 : _b.allowAlwaysPaths) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            this.bindings = [
                core_1.Binding.bind(keys_1.AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS).to(this.config.allowAlwaysPaths),
            ];
        }
        else {
            this.bindings = [
                core_1.Binding.bind(keys_1.AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS).to([
                    '/explorer',
                ]),
            ];
        }
    }
};
AuthorizationComponent = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.AuthorizationBindings.CONFIG)),
    tslib_1.__metadata("design:paramtypes", [Object])
], AuthorizationComponent);
exports.AuthorizationComponent = AuthorizationComponent;
//# sourceMappingURL=component.js.map