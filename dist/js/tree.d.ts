import { type DFTModelSchema, type MLModelSchema, type UnknownModelSchema, ApplicationSchema } from "@mat3ra/esse/dist/js/types";
import type { ModelTree } from "./types";
export declare const MODEL_TREE: {
    dft: {
        gga: {
            functionals: string[];
            methods: {
                localorbital: string[];
                pseudopotential: string[];
                unknown: string[];
            };
            modifiers: string[];
            refiners: string[];
        };
        hybrid: {
            functionals: string[];
            methods: {
                localorbital: string[];
                pseudopotential: string[];
                unknown: string[];
            };
        };
        lda: {
            functionals: string[];
            methods: {
                localorbital: string[];
                pseudopotential: string[];
                unknown: string[];
            };
            modifiers: string[];
            refiners: string[];
        };
        other: {
            functionals: string[];
            methods: {
                localorbital: string[];
                pseudopotential: string[];
                unknown: string[];
            };
        };
    };
    ml: {
        re: {
            methods: {
                kernel_ridge: string[];
                linear: string[];
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
    gga: string;
    hybrid: string;
    lda: string;
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
export declare const getDFTFunctionalsByApproximation: (approximation: "gga" | "lda" | "hybrid" | "other") => string[] | undefined;
export declare function treeSlugToNamedObject<T extends string>(modelSlug: T): {
    readonly slug: T;
    readonly name: string;
};
export declare const getTreeByApplicationNameAndVersion: ({ name, }: Pick<ApplicationSchema, "name" | "version">) => ModelTree | undefined;
export declare function getDefaultModelTypeSubtypeForApplication(application: Pick<ApplicationSchema, "name" | "version">): Pick<DFTModelSchema, "type" | "subtype"> | Pick<MLModelSchema, "type" | "subtype"> | Pick<UnknownModelSchema, "type" | "subtype">;
