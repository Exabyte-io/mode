import * as tree from "./tree";

export function safelyGetSlug(slugObj) {
    return typeof slugObj === "string" ? slugObj : slugObj.slug;
}

/**
 * The model interface converts between the legacy model data structure (type, subtype, functional)
 * and the categorized model data structure (tier1, tier2, ...).
 */
export class ModelConversionHandler {
    static convertToSimple(cm) {
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

    static convertDftToSimple(cm) {
        if (!cm.categories?.subtype) return this.convertUnknownToSimple();
        const { subtype } = cm.categories;
        const functional = cm.parameters?.functional;
        return {
            type: "dft",
            subtype,
            functional: tree.treeSlugToNamedObject(functional),
        };
    }

    static convertMlToSimple() {
        return {
            type: "ml",
            subtype: "re",
        };
    }

    static convertUnknownToSimple() {
        return {
            type: "unknown",
            subtype: "unknown",
        };
    }

    static convertToCategorized(sm, allModels = []) {
        switch (sm?.type) {
            case "dft":
                return this.convertDftToCategorized(sm, allModels);
            case "ml":
                return this.convertMlToCategorized(sm);
            case "unknown":
                return undefined;
            default:
                return undefined;
        }
    }

    static convertDftToCategorized(sm, allModels = []) {
        const { subtype, functional: functionalStringOrObject } = sm;
        const defaultFunctionals = { lda: "pz", gga: "pbe", hybrid: "b3lyp" };
        let functional;
        if (!functionalStringOrObject) {
            functional = defaultFunctionals[subtype];
        } else {
            functional = safelyGetSlug(functionalStringOrObject);
        }
        const path = `/pb/qm/dft/ksdft/${subtype}?functional=${functional}`;
        return allModels.find((cm) => cm.path === path);
    }

    static convertMlToCategorized(sm) {
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
