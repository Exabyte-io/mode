import type { ApplicationSchema, CategorizedMethod, CategorizedModel, CategorizedUnitMethod, DFTModelSchema, MLModelSchema, UnknownModelSchema } from "@mat3ra/esse/dist/js/types";
/**
 * Makes specified fields required and all others optional
 * TODO: consider moving to code.js
 */
export type RequireFields<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>;
type ModelRequiredFields = "type" | "subtype";
export type DFTModelConfig = RequireFields<DFTModelSchema, ModelRequiredFields>;
export type MLModelConfig = RequireFields<MLModelSchema, ModelRequiredFields>;
export type UnknownModelConfig = RequireFields<UnknownModelSchema, ModelRequiredFields>;
export type ModelConfig = (DFTModelConfig | MLModelConfig | UnknownModelConfig) & {
    application?: ApplicationSchema;
};
export type SimplifiedCategorizedModel = Pick<CategorizedModel, "name" | "path" | "categories" | "parameters">;
export type SimplifiedCategorizedMethod = Pick<CategorizedMethod, "name" | "path"> & {
    units: CategorizedUnitMethod[];
};
export interface MethodTreeBranch {
    methods: Record<string, string[]>;
    functionals?: string[];
    refiners?: string[];
    modifiers?: string[];
}
export type ModelTree = Record<string, Record<string, MethodTreeBranch>>;
export {};
