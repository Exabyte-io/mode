import type { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { BaseModel } from "@mat3ra/esse/dist/js/types";
export type ModelSchemaMixin = BaseModel;
export type ModelInMemoryEntity = InMemoryEntity & ModelSchemaMixin;
export declare function modelSchemaMixin(item: InMemoryEntity): void;
//# sourceMappingURL=ModelSchemaMixin.d.ts.map