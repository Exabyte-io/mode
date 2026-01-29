"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelConversionHandler = void 0;
exports.safelyGetSlug = safelyGetSlug;
function safelyGetSlug(slugObj) {
    return typeof slugObj === "string" ? slugObj : slugObj.slug;
}
class ModelConversionHandler {
    static convertToSimple(categorizedModel) {
        if (!categorizedModel)
            return this.convertUnknownToSimple();
        switch (categorizedModel.categories.tier3) {
            case "dft":
                return this.convertDftToSimple(categorizedModel);
            case "ml":
                return this.convertMlToSimple();
            default:
                return this.convertUnknownToSimple();
        }
    }
    static convertDftToSimple(categorizedModel) {
        var _a;
        if (!((_a = categorizedModel.categories) === null || _a === void 0 ? void 0 : _a.subtype)) {
            return this.convertUnknownToSimple();
        }
        const model = categorizedModel;
        const subtype = safelyGetSlug(model.categories.subtype);
        const functionalParam = model.parameters.functional;
        const functional = functionalParam
            ? safelyGetSlug(functionalParam)
            : undefined;
        return {
            type: "dft",
            subtype,
            functional, // old: tree.treeSlugToNamedObject(functional),
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
    static convertToCategorized(simpleModel, allModels) {
        switch (simpleModel === null || simpleModel === void 0 ? void 0 : simpleModel.type) {
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
    static convertDftToCategorized(simpleModel, allModels = []) {
        const { subtype, functional: functionalStringOrObject } = simpleModel;
        const defaultFunctionals = {
            lda: "pz",
            gga: "pbe",
            hybrid: "b3lyp",
        };
        let functional;
        if (!functionalStringOrObject) {
            functional = defaultFunctionals[subtype];
        }
        else {
            functional = safelyGetSlug(functionalStringOrObject);
        }
        const path = `/pb/qm/dft/ksdft/${subtype}?functional=${functional}`;
        return allModels.find((categorized) => categorized.path === path);
    }
    static convertMlToCategorized(simpleModel) {
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
        };
    }
}
exports.ModelConversionHandler = ModelConversionHandler;
