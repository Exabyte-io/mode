import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { type HashedEntity } from "@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin";
import type { ApplicationSchema, BaseInMemoryEntitySchema, BaseMethod, BaseModel, SlugifiedEntry, SlugifiedEntryOrSlug } from "@mat3ra/esse/dist/js/types";
import { type ModelSchemaMixin } from "./generated/ModelSchemaMixin";
import { Method } from "./method";
import { MethodFactory } from "./methods/factory";
import type { MethodTreeBranch, ModelConfig, ModelTree } from "./types";
export type ModelEntity = BaseInMemoryEntitySchema & Pick<BaseModel, "method"> & {
    type: string;
    subtype: SlugifiedEntryOrSlug;
    refiners?: SlugifiedEntry[];
    modifiers?: SlugifiedEntry[];
    functional?: string;
};
export interface Model extends ModelSchemaMixin, HashedEntity {
}
export declare class Model extends InMemoryEntity<ModelEntity> implements BaseModel {
    protected _application?: ApplicationSchema;
    protected _MethodFactory: typeof MethodFactory;
    protected _method?: Method;
    constructor(config: ModelConfig);
    setSubtype(subtype: SlugifiedEntryOrSlug): void;
    get allowedTypes(): SlugifiedEntry[];
    get allowedSubtypes(): SlugifiedEntry[];
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
    get methodTypes(): SlugifiedEntry[];
    get methodSubtypes(): SlugifiedEntry[];
    get defaultMethodConfig(): BaseMethod;
    static get defaultConfig(): {
        method: {
            readonly type: "pseudopotential";
            readonly subtype: "us";
        };
        type: "dft";
        subtype: "gga";
    };
    static get allTypes(): SlugifiedEntry[];
    toJSON(): ModelEntity;
    protected _stringToSlugifiedObject(slug: SlugifiedEntryOrSlug): SlugifiedEntry;
    get isUnknown(): boolean;
    protected get subtypeSlug(): string;
    getHashObject(): Record<string, unknown>;
}
