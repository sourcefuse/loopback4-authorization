"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DescSpecEnhancer = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
let DescSpecEnhancer = class DescSpecEnhancer {
    constructor() {
        this.name = 'info';
    }
    modifySpec(spec) {
        var _a;
        for (const controller of this.app.find(`${core_1.CoreBindings.CONTROLLERS}.*`)) {
            const ctor = controller.valueConstructor;
            if (ctor) {
                const endpoints = core_1.MetadataInspector.getAllMethodMetadata('openapi-v3:methods', ctor.prototype);
                for (const route in endpoints) {
                    const routeData = endpoints[route];
                    if (((_a = routeData === null || routeData === void 0 ? void 0 : routeData.spec) === null || _a === void 0 ? void 0 : _a.description) &&
                        !spec.paths[routeData.path][routeData.verb].description) {
                        spec.paths[routeData.path][routeData.verb].description =
                            routeData.spec.description;
                    }
                }
            }
        }
        return spec;
    }
};
tslib_1.__decorate([
    (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE),
    tslib_1.__metadata("design:type", core_1.Application)
], DescSpecEnhancer.prototype, "app", void 0);
DescSpecEnhancer = tslib_1.__decorate([
    (0, core_1.injectable)(rest_1.asSpecEnhancer)
], DescSpecEnhancer);
exports.DescSpecEnhancer = DescSpecEnhancer;
//# sourceMappingURL=spec-description-enhancer.js.map