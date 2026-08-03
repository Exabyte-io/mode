import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseInMemoryEntitySchema, BaseMethod } from "@mat3ra/esse/dist/js/types";
export type MethodSchemaMixin = BaseMethod;
export type MethodInMemoryEntity = InMemoryEntity<BaseInMemoryEntitySchema & MethodSchemaMixin>;
export declare function methodSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & MethodSchemaMixin;
