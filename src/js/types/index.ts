// Re-export ESSE base types as our config types
export type { BaseMethod as MethodConfig } from "@mat3ra/esse/dist/js/types";
import type { BaseMethod, BaseModel } from "@mat3ra/esse/dist/js/types";

// ModelConfig is like BaseModel but with optional method (common pattern in codebase)
export type ModelConfig = Omit<BaseModel, 'method'> & {
    method?: BaseMethod;
    [key: string]: unknown;
};

export interface NamedSlug {
    slug: string;
    name?: string;
}

export type StringOrNamedSlug = string | NamedSlug;

export interface ApplicationInfo {
    name: string;
    shortName: string;
    version?: string;
}

export interface PseudopotentialLike {
    element?: string;
    toJSON(): Record<string, unknown>;
}

export type PseudopotentialCtor = new (config: Record<string, unknown>) => PseudopotentialLike;

export interface ModelDescriptor {
    type: string;
    subtype: string;
}

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
