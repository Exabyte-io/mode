"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelSchemaMixin = modelSchemaMixin;
function modelSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.requiredProp("type");
        },
        get subtype() {
            return this.requiredProp("subtype");
        },
        get method() {
            return this.requiredProp("method");
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
//# sourceMappingURL=ModelSchemaMixin.js.map
