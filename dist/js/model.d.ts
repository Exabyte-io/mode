import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import type { Constructor } from "@mat3ra/code/dist/js/utils/types";
import type { BaseModel } from "@mat3ra/esse/dist/js/types";
import { type ModelSchemaMixin } from "./generated/ModelSchemaMixin";
import { Method } from "./method";
import { MethodFactory } from "./methods/factory";
import type { ApplicationInfo, MethodConfig, MethodTreeBranch, ModelTree, NamedSlug, StringOrNamedSlug } from "./types";
type Base = typeof InMemoryEntity & Constructor<ModelSchemaMixin>;
declare const Model_base: Base;
export declare class Model extends Model_base implements BaseModel {
    protected _application?: ApplicationInfo;
    protected _MethodFactory: typeof MethodFactory;
    protected _method?: Method;
    constructor(config: BaseModel);
    setSubtype(subtype: StringOrNamedSlug): void;
    get allowedTypes(): NamedSlug[];
    get allowedSubtypes(): NamedSlug[];
    get defaultType(): string;
    get defaultSubtype(): string;
    get tree(): ModelTree;
    get treeBranchForType(): Record<string, MethodTreeBranch>;
    get treeBranchForSubType(): MethodTreeBranch;
    get treeByApplicationNameAndVersion(): ModelTree | undefined;
    get groupSlug(): string;
    get Method(): Method;
    setMethod(method: Method): void;
    get methodsFromTree(): Record<string, string[]>;
    get methodTypes(): NamedSlug[];
    get methodSubtypes(): NamedSlug[];
    get defaultMethodConfig(): MethodConfig;
    static get defaultConfig(): ModelConfig;
    static get allTypes(): NamedSlug[];
    toJSON(): Record<string, unknown>;
    protected _stringToSlugifiedObject(slug: StringOrNamedSlug): NamedSlug;
    get isUnknown(): boolean;
    protected get subtypeSlug(): string;
}
export {};
//# sourceMappingURL=model.d.ts.map