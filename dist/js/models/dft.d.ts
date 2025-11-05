import { MethodFactory } from "../methods/factory";
import { Model } from "../model";
import type { ModelConfig, NamedSlug, StringOrNamedSlug } from "../types";
export declare class DFTModel extends Model {
    constructor(config: ModelConfig & {
        MethodFactory?: typeof MethodFactory;
    });
    get groupSlug(): string;
    get defaultFunctional(): NamedSlug;
    get defaultRefiners(): NamedSlug[];
    get defaultModifiers(): NamedSlug[];
    get functional(): NamedSlug;
    get refiners(): NamedSlug[];
    get modifiers(): NamedSlug[];
    setSubtype(subtype: StringOrNamedSlug): void;
    setFunctional(functional: StringOrNamedSlug): void;
    private _setArrayProp;
    setRefiners(refiners: StringOrNamedSlug | StringOrNamedSlug[]): void;
    setModifiers(modifiers: StringOrNamedSlug | StringOrNamedSlug[]): void;
    toJSON(): Record<string, unknown>;
    get allFunctionals(): NamedSlug[];
    get allRefiners(): NamedSlug[];
    get allModifiers(): NamedSlug[];
}
//# sourceMappingURL=dft.d.ts.map