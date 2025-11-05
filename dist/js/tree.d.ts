import { ApplicationSchemaBase, SlugifiedEntry } from "@mat3ra/esse/dist/js/types";
import type { ModelTree } from "./types";
export declare const METHODS: {
    readonly pseudopotential: "pseudopotential";
    readonly localorbital: "localorbital";
    readonly unknown: "unknown";
};
export declare const getPseudopotentialTypesFromTree: () => string[];
export declare const getDFTFunctionalsFromTree: () => string[];
export declare const getDFTFunctionalsByApproximation: (approximation: string) => string[] | undefined;
export declare const MODEL_TREE: ModelTree;
export declare const MODEL_NAMES: Record<string, string>;
export declare const treeSlugToNamedObject: (modelSlug: string) => SlugifiedEntry;
export declare const getTreeByApplicationNameAndVersion: ({ name, }: Pick<ApplicationSchemaBase, "name" | "version">) => ModelTree;
export declare const getDefaultModelTypeForApplication: (application: ApplicationSchemaBase) => string;
