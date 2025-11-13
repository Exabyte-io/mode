import { ApplicationSchemaBase, SlugifiedEntry } from "@mat3ra/esse/dist/js/types";
import type { ModelTree } from "./types";
export declare const MODEL_TREE: {
    dft: {
        gga: {
            refiners: string[];
            modifiers: string[];
            methods: {
                pseudopotential: string[];
                localorbital: string[];
                unknown: string[];
            };
            functionals: string[];
        };
        lda: {
            refiners: string[];
            modifiers: string[];
            methods: {
                pseudopotential: string[];
                localorbital: string[];
                unknown: string[];
            };
            functionals: string[];
        };
        hybrid: {
            methods: {
                pseudopotential: string[];
                localorbital: string[];
                unknown: string[];
            };
            functionals: string[];
        };
        other: {
            methods: {
                pseudopotential: string[];
                localorbital: string[];
                unknown: string[];
            };
            functionals: string[];
        };
    };
    ml: {
        re: {
            methods: {
                linear: string[];
                kernel_ridge: string[];
            };
        };
    };
    unknown: {
        unknown: {
            methods: {
                unknown: string[];
            };
        };
    };
}, MODEL_NAMES: {
    dft: string;
    lda: string;
    gga: string;
    hybrid: string;
    ml: string;
    re: string;
};
export declare const METHODS: {
    readonly pseudopotential: "pseudopotential";
    readonly localorbital: "localorbital";
    readonly unknown: "unknown";
};
export declare const getPseudopotentialTypesFromTree: () => string[];
export declare const getDFTFunctionalsFromTree: () => string[];
export declare const getDFTFunctionalsByApproximation: (approximation: string) => string[] | undefined;
export declare const treeSlugToNamedObject: (modelSlug: string) => SlugifiedEntry;
export declare const getTreeByApplicationNameAndVersion: ({ name, }: Pick<ApplicationSchemaBase, "name" | "version">) => ModelTree;
export declare const getDefaultModelTypeForApplication: (application: ApplicationSchemaBase) => string;
