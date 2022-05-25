"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTHORIZATION_METADATA_ACCESSOR = exports.AuthorizationBindings = void 0;
const context_1 = require("@loopback/context");
const metadata_1 = require("@loopback/metadata");
/**
 * Binding keys used by this component.
 */
var AuthorizationBindings;
(function (AuthorizationBindings) {
    AuthorizationBindings.AUTHORIZE_ACTION = context_1.BindingKey.create('sf.userAuthorization.actions.authorize');
    AuthorizationBindings.CASBIN_AUTHORIZE_ACTION = context_1.BindingKey.create('sf.userAuthorization.actions.casbin.authorize');
    AuthorizationBindings.METADATA = context_1.BindingKey.create('sf.userAuthorization.operationMetadata');
    AuthorizationBindings.USER_PERMISSIONS = context_1.BindingKey.create('sf.userAuthorization.actions.userPermissions');
    AuthorizationBindings.CASBIN_ENFORCER_CONFIG_GETTER = context_1.BindingKey.create('sf.userAuthorization.actions.casbin.config');
    AuthorizationBindings.CASBIN_RESOURCE_MODIFIER_FN = context_1.BindingKey.create('sf.userAuthorization.actions.casbin.resourceModifier');
    AuthorizationBindings.CONFIG = context_1.BindingKey.create('sf.userAuthorization.config');
    AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS = 'sf.userAuthorization.allowAlways';
})(AuthorizationBindings = exports.AuthorizationBindings || (exports.AuthorizationBindings = {}));
exports.AUTHORIZATION_METADATA_ACCESSOR = metadata_1.MetadataAccessor.create('sf.userAuthorization.accessor.operationMetadata');
//# sourceMappingURL=keys.js.map