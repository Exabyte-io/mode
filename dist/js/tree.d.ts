import type { ApplicationInfo, ModelTree, NamedSlug } from "./types";
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
export declare const treeSlugToNamedObject: (modelSlug: string) => NamedSlug;
export declare const getTreeByApplicationNameAndVersion: ({ name, version, }: Pick<ApplicationInfo, "name" | "version">) => ModelTree;
export declare const getDefaultModelTypeForApplication: (application: ApplicationInfo) => string;
//# sourceMappingURL=tree.d.ts.map