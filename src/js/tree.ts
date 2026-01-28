import {
    type DFTModelSchema,
    type MLModelSchema,
    type UnknownModelSchema,
    ApplicationSchema,
    SlugifiedEntry,
} from "@mat3ra/esse/dist/js/types";
import MODELS_TREE_CONFIG_BY_APPLICATION from "@mat3ra/standata/dist/js/runtime_data/models/modelsTreeConfigByApplication.json";
import MODEL_TREE_DATA from "@mat3ra/standata/dist/js/runtime_data/models/modelTree.json";
import lodash from "lodash";

import type { ModelTree } from "./types";

export const { MODEL_TREE, MODEL_NAMES } = MODEL_TREE_DATA;

export const METHODS = {
    pseudopotential: "pseudopotential",
    localorbital: "localorbital",
    unknown: "unknown",
} as const;

export const getPseudopotentialTypesFromTree = (): string[] => {
    const dftTree = MODEL_TREE.dft;
    const firstBranch = Object.values(dftTree)[0];
    return firstBranch?.methods?.pseudopotential || [];
};

export const getDFTFunctionalsFromTree = (): string[] => {
    return Object.keys(MODEL_TREE.dft);
};

export const getDFTFunctionalsByApproximation = (
    approximation: "gga" | "lda" | "hybrid" | "other",
): string[] | undefined => {
    const dftTree = MODEL_TREE.dft;
    const branch = dftTree[approximation];
    return branch?.functionals;
};

export const treeSlugToNamedObject = (modelSlug: string): SlugifiedEntry => {
    return {
        slug: modelSlug,
        name: lodash.get(MODEL_NAMES, modelSlug, modelSlug),
    };
};

export const getTreeByApplicationNameAndVersion = ({
    name,
}: Pick<ApplicationSchema, "name" | "version">): ModelTree | undefined => {
    // TODO: add logic to filter by version when necessary
    if (!(name in MODELS_TREE_CONFIG_BY_APPLICATION)) {
        return undefined;
    }
    return MODELS_TREE_CONFIG_BY_APPLICATION[
        name as keyof typeof MODELS_TREE_CONFIG_BY_APPLICATION
    ];
};

export function getDefaultModelTypeSubtypeForApplication(
    application: Pick<ApplicationSchema, "name" | "version">,
) {
    const tree = getTreeByApplicationNameAndVersion(application);

    if (!tree) {
        throw new Error(
            `getDefaultModelTypeForApplication: tree not found for application ${application.name}`,
        );
    }

    const type = Object.keys(tree)[0];
    const subtype = Object.keys(tree[type] || {})[0] || "unknown";

    return { type, subtype } as
        | Pick<DFTModelSchema, "type" | "subtype">
        | Pick<MLModelSchema, "type" | "subtype">
        | Pick<UnknownModelSchema, "type" | "subtype">;
}
