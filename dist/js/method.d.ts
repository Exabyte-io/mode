import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { type HashedEntity } from "@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import type { BaseMethod, SlugifiedEntry } from "@mat3ra/esse/dist/js/types";
import { type MethodSchemaMixin } from "./generated/MethodSchemaMixin";
type Base = typeof InMemoryEntity & Constructor<MethodSchemaMixin> & Constructor<HashedEntity>;
interface MethodData extends Record<string, unknown> {
    searchText?: string;
}
declare const Method_base: Base;
export declare class Method extends Method_base implements BaseMethod {
    constructor(config: BaseMethod);
    toJSON: () => BaseMethod & AnyObject;
    cloneWithoutData(): Method;
    setSubtype(subtype: SlugifiedEntry): void;
    static get defaultConfig(): {
        readonly type: "pseudopotential";
        readonly subtype: "us";
    };
    get searchText(): string;
    setSearchText(searchText: string): void;
    setData(data?: MethodData): void;
    cleanData(fieldsToExclude?: string[]): MethodData;
    toJSONWithCleanData(fieldsToExclude?: string[]): BaseMethod;
    getHashObject(): Record<string, unknown>;
}
export {};
