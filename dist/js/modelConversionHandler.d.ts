import { type DFTModelSchema, type MLModelSchema, type UnknownModelSchema, CategorizedModel, SlugifiedEntryOrSlug } from "@mat3ra/esse/dist/js/types";
import type { DFTModelConfig, SimplifiedCategorizedModel, UnknownModelConfig } from "./types";
export declare function safelyGetSlug(slugObj: SlugifiedEntryOrSlug): string;
export declare class ModelConversionHandler {
    static convertToSimple(categorizedModel?: CategorizedModel): DFTModelConfig | {
        readonly type: "unknown";
        readonly subtype: "unknown";
    } | {
        readonly type: "ml";
        readonly subtype: "re";
    };
    static convertDftToSimple(categorizedModel: CategorizedModel): DFTModelConfig | UnknownModelConfig;
    static convertMlToSimple(): {
        readonly type: "ml";
        readonly subtype: "re";
    };
    static convertUnknownToSimple(): {
        readonly type: "unknown";
        readonly subtype: "unknown";
    };
    static convertToCategorized(simpleModel?: DFTModelSchema | MLModelSchema | UnknownModelSchema, allModels?: CategorizedModel[]): SimplifiedCategorizedModel | {
        readonly name: "Regression";
        readonly path: "/st/det/ml/re/none";
        readonly categories: {
            readonly tier1: "st";
            readonly tier2: "det";
            readonly tier3: "ml";
            readonly type: string;
        };
        readonly parameters: {};
    } | undefined;
    static convertDftToCategorized(simpleModel: DFTModelSchema, allModels?: CategorizedModel[]): SimplifiedCategorizedModel | undefined;
    static convertMlToCategorized(simpleModel: MLModelSchema): {
        readonly name: "Regression";
        readonly path: "/st/det/ml/re/none";
        readonly categories: {
            readonly tier1: "st";
            readonly tier2: "det";
            readonly tier3: "ml";
            readonly type: string;
        };
        readonly parameters: {};
    };
}
