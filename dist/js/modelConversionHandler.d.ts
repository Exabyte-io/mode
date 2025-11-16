import { CategorizedModel, SlugifiedEntryOrSlug } from "@mat3ra/esse/dist/js/types";
import type { ModelConfig, SimplifiedCategorizedModel } from "./types";
export declare function safelyGetSlug(slugObj: SlugifiedEntryOrSlug): string;
export declare class ModelConversionHandler {
    static convertToSimple(categorizedModel: CategorizedModel | undefined): ModelConfig;
    static convertDftToSimple(categorizedModel: CategorizedModel): ModelConfig;
    static convertMlToSimple(): ModelConfig;
    static convertUnknownToSimple(): ModelConfig;
    static convertToCategorized(simpleModel: ModelConfig | undefined, allModels?: CategorizedModel[]): SimplifiedCategorizedModel | undefined;
    static convertDftToCategorized(simpleModel: ModelConfig, allModels?: CategorizedModel[]): SimplifiedCategorizedModel | undefined;
    static convertMlToCategorized(simpleModel: ModelConfig): SimplifiedCategorizedModel;
}
