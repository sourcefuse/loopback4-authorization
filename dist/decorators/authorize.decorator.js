"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const core_1 = require("@loopback/core");
const keys_1 = require("../keys");
const spec_preprocessor_1 = require("./spec-preprocessor");
const OAI3KEY_METHODS = 'openapi-v3:methods';
function authorize(metadata) {
    var _a, _b;
    const authorizedecorator = core_1.MethodDecoratorFactory.createDecorator(keys_1.AUTHORIZATION_METADATA_ACCESSOR, {
        permissions: metadata.permissions || [],
        resource: (_a = metadata.resource) !== null && _a !== void 0 ? _a : '',
        isCasbinPolicy: (_b = metadata.isCasbinPolicy) !== null && _b !== void 0 ? _b : false,
    });
    const authorizationWithMetadata = (target, propertyKey, descriptor) => {
        const meta = core_1.MetadataInspector.getMethodMetadata(OAI3KEY_METHODS, target, propertyKey);
        if (meta) {
            meta.spec = (0, spec_preprocessor_1.specPreprocessor)(target, propertyKey, metadata, meta.spec);
            core_1.Reflector.deleteMetadata(OAI3KEY_METHODS, target, propertyKey);
            core_1.Reflector.defineMetadata(OAI3KEY_METHODS, meta, target, propertyKey);
            authorizedecorator(target, propertyKey, descriptor);
        }
    };
    return authorizationWithMetadata;
}
exports.authorize = authorize;
//# sourceMappingURL=authorize.decorator.js.map