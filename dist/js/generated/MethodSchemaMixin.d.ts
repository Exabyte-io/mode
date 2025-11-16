import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseMethod } from "@mat3ra/esse/dist/js/types";
export type MethodSchemaMixin = BaseMethod;
export type MethodInMemoryEntity = InMemoryEntity & MethodSchemaMixin;
export declare function methodSchemaMixin(item: InMemoryEntity): void;
