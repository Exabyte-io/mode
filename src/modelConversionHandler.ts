// @ts-nocheck
import { categorizedModelList, tree } from "@exabyte-io/mode.js/dist";
import {
    BaseModel,
    CategorizedModel,
    LegacyModelDensityFunctionalTheory,
    LegacyModelRegression,
    LegacyModelUnknown,
    ModelGeneralizedGradientApproximation,
    ModelHybridFunctional,
    ModelLocalDensityApproximation,
    ModelRegression,
} from "@mat3ra/esse/dist/js//types";

type CategorizedDftModel =
    | Omit<ModelLocalDensityApproximation, "method">
    | Omit<ModelGeneralizedGradientApproximation, "method">
    | Omit<ModelHybridFunctional, "method">;

export function safelyGetSlug(slugObj: { slug: string } | string): string {
    return typeof slugObj === "string" ? slugObj : slugObj.slug;
}

/**
 * The model interface converts between the legacy model data structure (type, subtype, functional)
 * and the categorized model data structure (tier1, tier2, ...).
 */
export class ModelConversionHandler {
    static convertToSimple(cm?: Omit<CategorizedModel, "method">): Omit<BaseModel, "method"> {
        if (!cm) return this.convertUnknownToSimple();

        // eslint-disable-next-line default-case
        switch (cm.categories.tier3) {
            case "dft":
                return this.convertDftToSimple(cm);
            case "ml":
                return this.convertMlToSimple();
            default:
                return this.convertUnknownToSimple();
        }
    }

    static convertDftToSimple(
        cm: CategorizedDftModel,
    ): Omit<LegacyModelDensityFunctionalTheory, "method"> {
        if (!cm.categories?.subtype) return this.convertUnknownToSimple();
        const { subtype } = cm.categories;
        const functional = cm.parameters?.functional;
        return {
            type: "dft",
            subtype,
            functional: tree.treeSlugToNamedObject(functional),
        };
    }

    static convertMlToSimple(): Omit<LegacyModelRegression, "method"> {
        return {
            type: "ml",
            subtype: "re",
        };
    }

    static convertUnknownToSimple(): Omit<LegacyModelUnknown, "method"> {
        return {
            type: "unknown",
            subtype: "unknown",
        };
    }

    static convertToCategorized(sm?: BaseModel): Omit<CategorizedModel, "method"> | undefined {
        switch (sm?.type) {
            case "dft":
                return this.convertDftToCategorized(sm as LegacyModelDensityFunctionalTheory);
            case "ml":
                return this.convertMlToCategorized(sm);
            case "unknown":
                return undefined;
            default:
                return undefined;
        }
    }

    static convertDftToCategorized(sm: LegacyModelDensityFunctionalTheory): CategorizedDftModel {
        const { subtype, functional: functionalStringOrObject } = sm;
        const defaultFunctionals = { lda: "pz", gga: "pbe", hybrid: "b3lyp" };
        let functional: string;
        if (!functionalStringOrObject) {
            functional = defaultFunctionals[subtype];
        } else {
            functional = safelyGetSlug(functionalStringOrObject);
        }
        const path = `/pb/qm/dft/ksdft/${subtype}?functional=${functional}`;
        return categorizedModelList.find(
            (cm: Omit<CategorizedModel, "method">) => cm.path === path,
        ) as CategorizedDftModel;
    }

    static convertMlToCategorized(sm: BaseModel): Omit<ModelRegression, "method"> {
        const subtype = safelyGetSlug(sm.subtype);
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
        };
    }
}
