import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { MethodConfig, MethodConfigWithData, MethodData, StringOrNamedSlug } from "./types";
export declare class Method extends InMemoryEntity<MethodConfigWithData> {
    constructor(config: MethodConfig);
    cloneWithoutData(): Method;
    get type(): string;
    get subtype(): StringOrNamedSlug;
    setSubtype(subtype: StringOrNamedSlug): void;
    static get defaultConfig(): MethodConfig;
    get precision(): number | undefined;
    get data(): MethodData;
    get searchText(): string;
    setSearchText(searchText: string): void;
    setData(data?: MethodData): void;
    get omitInHashCalculation(): boolean;
    cleanData(fieldsToExclude?: string[]): MethodData;
    toJSONWithCleanData(fieldsToExclude?: string[]): MethodConfig;
}
//# sourceMappingURL=method.d.ts.map