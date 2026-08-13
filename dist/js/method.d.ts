import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { type HashedEntity } from "@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin";
import type { BaseInMemoryEntitySchema, BaseMethod, FileDataItem, SlugifiedEntry } from "@mat3ra/esse/dist/js/types";
import { type MethodSchemaMixin } from "./generated/MethodSchemaMixin";
type MethodEntity = BaseMethod & BaseInMemoryEntitySchema;
export interface Method extends MethodSchemaMixin, HashedEntity {
}
interface MethodData extends Record<string, unknown> {
    searchText?: string;
    pseudo?: FileDataItem[];
    allPseudo?: FileDataItem[];
}
export declare class Method extends InMemoryEntity<MethodEntity> implements BaseMethod, HashedEntity {
    constructor(config: BaseMethod);
    cloneWithoutData(): Method;
    setSubtype(subtype: SlugifiedEntry): void;
    static get defaultConfig(): {
        readonly type: "pseudopotential";
        readonly subtype: "us";
    };
    get methodData(): MethodData;
    get searchText(): string;
    setSearchText(searchText: string): void;
    setData(data?: MethodData): void;
    cleanData(fieldsToExclude?: string[]): MethodData;
    toJSONWithCleanData(fieldsToExclude?: string[]): BaseMethod;
    getHashObject(): Record<string, unknown>;
}
export {};
