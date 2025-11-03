import type { EntityConfig } from "@mat3ra/code/dist/js/entity";

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

export interface MethodData extends Record<string, unknown> {
    searchText?: string;
}

export interface MethodConfig extends EntityConfig {
    type: string;
    subtype: StringOrNamedSlug;
    precision?: number;
    data?: MethodData;
    extraData?: Record<string, unknown>;
    isEdited?: boolean;
    [key: string]: unknown;
}

export interface MethodConfigWithData extends MethodConfig {
    data: MethodData;
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
