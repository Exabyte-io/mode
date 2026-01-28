import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseMethod } from "@mat3ra/esse/dist/js/types";

export type MethodSchemaMixin = BaseMethod;

export type MethodInMemoryEntity = InMemoryEntity & MethodSchemaMixin;

export function methodSchemaMixin<T extends InMemoryEntity>(
    item: InMemoryEntity,
): asserts item is T & MethodSchemaMixin {
    // @ts-expect-error
    const properties: InMemoryEntity & MethodSchemaMixin = {
        get type() {
            return this.requiredProp<BaseMethod["type"]>("type");
        },
        set type(value: BaseMethod["type"]) {
            this.setProp("type", value);
        },
        get subtype() {
            return this.requiredProp<BaseMethod["subtype"]>("subtype");
        },
        set subtype(value: BaseMethod["subtype"]) {
            this.setProp("subtype", value);
        },
        get precision() {
            return this.prop<BaseMethod["precision"]>("precision");
        },
        set precision(value: BaseMethod["precision"]) {
            this.setProp("precision", value);
        },
        get data() {
            return this.prop<BaseMethod["data"]>("data");
        },
        set data(value: BaseMethod["data"]) {
            this.setProp("data", value);
        },
    };

    Object.defineProperties(item, Object.getOwnPropertyDescriptors(properties));
}
