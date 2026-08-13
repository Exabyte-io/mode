import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseInMemoryEntitySchema, BaseModel } from "@mat3ra/esse/dist/js/types";
export type ModelSchemaMixin = BaseModel;
export type ModelInMemoryEntity = InMemoryEntity<BaseInMemoryEntitySchema & ModelSchemaMixin>;
export declare function modelSchemaMixin<T extends InMemoryEntity>(item: InMemoryEntity): asserts item is T & ModelSchemaMixin;
