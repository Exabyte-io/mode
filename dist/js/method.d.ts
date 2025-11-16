import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { BaseMethod, SlugifiedEntry } from "@mat3ra/esse/dist/js/types";
import { type MethodSchemaMixin } from "./generated/MethodSchemaMixin";
type Base = typeof InMemoryEntity & Constructor<MethodSchemaMixin>;
interface MethodData extends Record<string, unknown> {
    searchText?: string;
}
declare const Method_base: Base;
export declare class Method extends Method_base implements BaseMethod {
    constructor(config: BaseMethod);
    cloneWithoutData(): Method;
    setSubtype(subtype: SlugifiedEntry): void;
    static get defaultConfig(): BaseMethod;
    get searchText(): string;
    setSearchText(searchText: string): void;
    setData(data?: MethodData): void;
    get omitInHashCalculation(): boolean;
    cleanData(fieldsToExclude?: string[]): MethodData;
    toJSONWithCleanData(fieldsToExclude?: string[]): BaseMethod;
}
export {};
