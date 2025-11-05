"use strict";
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, "default", { enumerable: true, value: v });
          }
        : function (o, v) {
              o["default"] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    (function () {
        var ownKeys = function (o) {
            ownKeys =
                Object.getOwnPropertyNames ||
                function (o) {
                    var ar = [];
                    for (var k in o)
                        if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
                    return ar;
                };
            return ownKeys(o);
        };
        return function (mod) {
            if (mod && mod.__esModule) return mod;
            var result = {};
            if (mod != null)
                for (var k = ownKeys(mod), i = 0; i < k.length; i++)
                    if (k[i] !== "default") __createBinding(result, mod, k[i]);
            __setModuleDefault(result, mod);
            return result;
        };
    })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelConversionHandler = void 0;
exports.safelyGetSlug = safelyGetSlug;
const tree = __importStar(require("./tree"));
function safelyGetSlug(slugObj) {
    return typeof slugObj === "string" ? slugObj : slugObj.slug;
}
class ModelConversionHandler {
    static convertToSimple(categorizedModel) {
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
    static convertDftToSimple(categorizedModel) {
        var _a, _b;
        if (!((_a = categorizedModel.categories) === null || _a === void 0 ? void 0 : _a.subtype))
            return this.convertUnknownToSimple();
        const subtypeCategory = categorizedModel.categories.subtype;
        const subtype = safelyGetSlug(subtypeCategory);
        const functionalParam =
            (_b = categorizedModel.parameters) === null || _b === void 0 ? void 0 : _b.functional;
        const functionalSlug = functionalParam ? safelyGetSlug(functionalParam) : "";
        return {
            type: "dft",
            subtype,
            functional: tree.treeSlugToNamedObject(functionalSlug),
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
    static convertToCategorized(simpleModel, allModels = []) {
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
        } else {
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
