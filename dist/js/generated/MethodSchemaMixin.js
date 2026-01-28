"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodSchemaMixin = methodSchemaMixin;
function methodSchemaMixin(item) {
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
        get precision() {
            return this.prop("precision");
        },
        set precision(value) {
            this.setProp("precision", value);
        },
        get data() {
            return this.prop("data");
        },
        set data(value) {
            this.setProp("data", value);
        },
    };
    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
