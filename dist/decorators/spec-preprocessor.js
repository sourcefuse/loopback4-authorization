"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specPreprocessor = void 0;
const defaultResponse = (ctor, op) => ({
    '200': {
        description: `Return value of ${ctor.name}.${op}`,
        content: {},
    },
});
const specPreprocessor = (target, propertyKey, authorizations, spec) => {
    var _a;
    let desc = (_a = spec === null || spec === void 0 ? void 0 : spec.description) !== null && _a !== void 0 ? _a : '';
    if ((authorizations === null || authorizations === void 0 ? void 0 : authorizations.permissions) && (authorizations === null || authorizations === void 0 ? void 0 : authorizations.permissions.length) > 0) {
        authorizations.permissions
            .filter((permission) => permission.trim() !== '*')
            .forEach((permission, i) => {
            if (i === 0) {
                desc += `\n\n| Permissions |\n| ------- |\n`;
            }
            desc += `| ${permission}   |\n`;
        });
    }
    if (spec) {
        spec.description = desc;
    }
    else {
        spec = {
            description: desc,
            responses: defaultResponse(target.constructor, propertyKey),
        };
    }
    return spec;
};
exports.specPreprocessor = specPreprocessor;
//# sourceMappingURL=spec-preprocessor.js.map