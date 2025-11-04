import type { ApplicationSchemaBase, BaseMethod, BaseModel } from "@mat3ra/esse/dist/js/types";

// ModelConfig: BaseModel with optional method and application (repo-specific pattern)
export type ModelConfig = Omit<BaseModel, "method"> & {
    method?: BaseMethod;
    application?: ApplicationSchemaBase;
    [key: string]: unknown;
};

// ModelDescriptor: subset of BaseModel
export type ModelDescriptor = Pick<BaseModel, "type" | "subtype">;

export interface PseudopotentialLike {
    element?: string;
    toJSON(): Record<string, unknown>;
}

export type PseudopotentialCtor = new (config: Record<string, unknown>) => PseudopotentialLike;

export interface CategorizedUnit {
    categories: Record<string, any>;
    parameters?: Record<string, unknown>;
    tags?: string[];
    name?: string;
    path?: string;
    precision?: number;
    data?: Record<string, unknown>;
}

export interface CategorizedMethod {
    units: CategorizedUnit[];
    name: string;
    path: string;
}

export interface CategorizedModel {
    name: string;
    path: string;
    categories: Record<string, any>;
    parameters?: Record<string, unknown>;
}

export interface MethodTreeBranch {
    methods: Record<string, string[]>;
    functionals?: string[];
    refiners?: string[];
    modifiers?: string[];
}

export type ModelTree = Record<string, Record<string, MethodTreeBranch>>;
