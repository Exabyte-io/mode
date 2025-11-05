import type { CategorizedMethod, CategorizedUnit, MethodConfig, StringOrNamedSlug } from "./types";
export declare function safelyGetSlug(slugObj: StringOrNamedSlug): string;
export declare class MethodConversionHandler {
    static convertToSimple(categorizedMethod: CategorizedMethod | undefined): MethodConfig;
    static convertUnknownToSimple(): MethodConfig;
    static convertPspUnitsToSimple(units: CategorizedUnit[]): MethodConfig;
    static convertAoUnitToSimple(): MethodConfig;
    static convertRegressionUnitToSimple(unit: CategorizedUnit): MethodConfig;
    static convertToCategorized(simpleMethod: MethodConfig | undefined, allMethods?: CategorizedMethod[]): CategorizedMethod | undefined;
    static convertPspToCategorized(simpleMethod: MethodConfig, allMethods?: CategorizedMethod[]): CategorizedMethod | undefined;
    static convertAoToCategorized(simpleMethod: MethodConfig): CategorizedMethod;
    static convertRegressionToCategorized(simpleMethod: MethodConfig): CategorizedMethod;
}
//# sourceMappingURL=methodConversionHandler.d.ts.map