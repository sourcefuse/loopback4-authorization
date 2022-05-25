"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinEnforcerProvider = void 0;
const rest_1 = require("@loopback/rest");
class CasbinEnforcerProvider {
    constructor() { }
    value() {
        return async (authUser, resource, isCasbinPolicy) => {
            throw new rest_1.HttpErrors.NotImplemented(`CasbinEnforcerConfigGetterFn Provider is not implemented`);
        };
    }
}
exports.CasbinEnforcerProvider = CasbinEnforcerProvider;
//# sourceMappingURL=casbin-enforcer-config.provider.js.map