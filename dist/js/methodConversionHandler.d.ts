import { BaseMethod, CategorizedMethod, CategorizedUnitMethod, SlugifiedEntry } from "@mat3ra/esse/dist/js/types";
import type { SimplifiedCategorizedMethod } from "./types";
export declare function safelyGetSlug(slugObj: SlugifiedEntry | string): SlugifiedEntry["slug"];
export declare class MethodConversionHandler {
    static convertToSimple(categorizedMethod: CategorizedMethod | undefined): BaseMethod;
    static convertUnknownToSimple(): BaseMethod;
    static convertPspUnitsToSimple(units: CategorizedUnitMethod[]): BaseMethod;
    static convertAoUnitToSimple(): BaseMethod;
    static convertRegressionUnitToSimple(unit: CategorizedUnitMethod): BaseMethod;
    static convertToCategorized(simpleMethod: BaseMethod | undefined, allMethods?: CategorizedMethod[]): SimplifiedCategorizedMethod | undefined;
    static convertPspToCategorized(simpleMethod: BaseMethod, allMethods?: CategorizedMethod[]): SimplifiedCategorizedMethod | undefined;
    static convertAoToCategorized(simpleMethod: BaseMethod): SimplifiedCategorizedMethod;
    static convertRegressionToCategorized(simpleMethod: BaseMethod): SimplifiedCategorizedMethod;
}
