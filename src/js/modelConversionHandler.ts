import {
    type DFTModelSchema,
    type MLModelSchema,
    type UnknownModelSchema,
    CategorizedModel,
    SlugifiedEntryOrSlug,
} from "@mat3ra/esse/dist/js/types";

import type { DFTModelConfig, SimplifiedCategorizedModel, UnknownModelConfig } from "./types";

export function safelyGetSlug(slugObj: SlugifiedEntryOrSlug): string {
    return typeof slugObj === "string" ? slugObj : slugObj.slug;
}

export class ModelConversionHandler {
    static convertToSimple(categorizedModel?: CategorizedModel) {
        if (!categorizedModel) return this.convertUnknownToSimple();
        switch (categorizedModel.categories.tier3) {
            case "dft":
                return this.convertDftToSimple(categorizedModel);
            case "ml":
                return this.convertMlToSimple();
            default:
                return this.convertUnknownToSimple();
        }
    }

    static convertDftToSimple(
        categorizedModel: CategorizedModel,
    ): DFTModelConfig | UnknownModelConfig {
        if (!categorizedModel.categories?.subtype) {
            return this.convertUnknownToSimple();
        }

        const model = categorizedModel as {
            categories: { subtype: SlugifiedEntryOrSlug };
            parameters: { functional?: SlugifiedEntryOrSlug };
        };

        const subtype = safelyGetSlug(model.categories.subtype) as DFTModelConfig["subtype"];
        const functionalParam = model.parameters.functional;
        const functional = functionalParam
            ? (safelyGetSlug(functionalParam) as DFTModelConfig["functional"])
            : undefined;

        return {
            type: "dft",
            subtype,
            functional, // old: tree.treeSlugToNamedObject(functional),
        } as const;
    }

    static convertMlToSimple() {
        return {
            type: "ml",
            subtype: "re",
        } as const;
    }

    static convertUnknownToSimple() {
        return {
            type: "unknown",
            subtype: "unknown",
        } as const;
    }

    static convertToCategorized(
        simpleModel?: DFTModelSchema | MLModelSchema | UnknownModelSchema,
        allModels: CategorizedModel[] = [],
    ) {
        switch (simpleModel?.type) {
            case "dft":
                return this.convertDftToCategorized(simpleModel, allModels);
            case "ml":
                return this.convertMlToCategorized(simpleModel);
            case "unknown":
                return undefined;
            default:
                return undefined;
        }
    }

    static convertDftToCategorized(
        simpleModel: DFTModelSchema,
        allModels: CategorizedModel[] = [],
    ): SimplifiedCategorizedModel | undefined {
        const { subtype, functional: functionalStringOrObject } = simpleModel;
        const defaultFunctionals: Record<string, string> = {
            lda: "pz",
            gga: "pbe",
            hybrid: "b3lyp",
        };
        let functional: string | undefined;
        if (!functionalStringOrObject) {
            functional = defaultFunctionals[subtype as string];
        } else {
            functional = safelyGetSlug(functionalStringOrObject);
        }
        const path = `/pb/qm/dft/ksdft/${subtype}?functional=${functional}`;

        return allModels.find((categorized) => categorized.path === path);
    }

    static convertMlToCategorized(simpleModel: MLModelSchema) {
        const subtype = safelyGetSlug(simpleModel.subtype);

        return {
            name: "Regression",
            path: "/st/det/ml/re/none",
            categories: {
                tier1: "st",
                tier2: "det",
                tier3: "ml",
                type: subtype,
            },
            parameters: {},
        } as const;
    }
}
