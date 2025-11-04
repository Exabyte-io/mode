import type {
    ApplicationSchemaBase,
    BaseModel,
    CategorizedMethod,
    CategorizedModel,
    CategorizedUnitMethod,
} from "@mat3ra/esse/dist/js/types";

export type SimplifiedCategorizedModel = Pick<CategorizedModel, "name" | "path"> & {
    categories: Record<string, any>;
    parameters?: Record<string, unknown>;
};

export type SimplifiedCategorizedMethod = Pick<CategorizedMethod, "name" | "path"> & {
    units: CategorizedUnitMethod[];
};

export type ModelConfig = Omit<BaseModel, "method"> & {
    method?: BaseModel["method"];
    application?: ApplicationSchemaBase;
};

export interface PseudopotentialLike {
    element?: string;
    toJSON(): Record<string, unknown>;
}

export type PseudopotentialCtor = new (config: Record<string, unknown>) => PseudopotentialLike;

export interface MethodTreeBranch {
    methods: Record<string, string[]>;
    functionals?: string[];
    refiners?: string[];
    modifiers?: string[];
}

export type ModelTree = Record<string, Record<string, MethodTreeBranch>>;
