"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodSchemaMixin = methodSchemaMixin;
function methodSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.requiredProp("type");
        },
        get subtype() {
            return this.requiredProp("subtype");
        },
        get precision() {
            return this.prop("precision");
        },
        get data() {
            return this.prop("data");
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
