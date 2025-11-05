import type { CategorizedModel, ModelConfig, StringOrNamedSlug } from "./types";
export declare function safelyGetSlug(slugObj: StringOrNamedSlug): string;
export declare class ModelConversionHandler {
    static convertToSimple(categorizedModel: CategorizedModel | undefined): ModelConfig;
    static convertDftToSimple(categorizedModel: CategorizedModel): ModelConfig;
    static convertMlToSimple(): ModelConfig;
    static convertUnknownToSimple(): ModelConfig;
    static convertToCategorized(simpleModel: ModelConfig | undefined, allModels?: CategorizedModel[]): CategorizedModel | undefined;
    static convertDftToCategorized(simpleModel: ModelConfig, allModels?: CategorizedModel[]): CategorizedModel | undefined;
    static convertMlToCategorized(simpleModel: ModelConfig): CategorizedModel;
}
//# sourceMappingURL=modelConversionHandler.d.ts.map