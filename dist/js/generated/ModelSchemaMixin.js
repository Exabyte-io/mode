"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelSchemaMixin = modelSchemaMixin;
function modelSchemaMixin(item) {
    // @ts-expect-error
    const properties = {
        get type() {
            return this.requiredProp("type");
        },
        set type(value) {
            this.setProp("type", value);
        },
        get subtype() {
            return this.requiredProp("subtype");
        },
        set subtype(value) {
            this.setProp("subtype", value);
        },
        get method() {
            return this.requiredProp("method");
        },
        set method(value) {
            this.setProp("method", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
