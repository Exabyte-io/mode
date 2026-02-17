import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import { type DFTModelSchema, SlugifiedEntry, SlugifiedEntryOrSlug } from "@mat3ra/esse/dist/js/types";
import { MethodFactory } from "../methods/factory";
import { Model } from "../model";
import type { ModelConfig } from "../types";
export declare class DFTModel extends Model {
    constructor(config: ModelConfig & {
        MethodFactory?: typeof MethodFactory;
    });
    type: DFTModelSchema["type"];
    subtype: DFTModelSchema["subtype"];
    get groupSlug(): string;
    private get defaultFunctional();
    readonly defaultRefiners: SlugifiedEntry[];
    readonly defaultModifiers: SlugifiedEntry[];
    get slugifiedFunctional(): SlugifiedEntry;
    get functional(): "pbe" | "pbesol" | "pw91" | "other" | "pz" | "pw" | "vwn" | "b3lyp" | "hse06";
    set functional(functional: "pbe" | "pbesol" | "pw91" | "other" | "pz" | "pw" | "vwn" | "b3lyp" | "hse06");
    get refiners(): SlugifiedEntry[];
    get modifiers(): SlugifiedEntry[];
    setSubtype(subtype: SlugifiedEntryOrSlug): void;
    setFunctional(functional: string): void;
    private _setArrayProp;
    setRefiners(refiners: SlugifiedEntryOrSlug | SlugifiedEntryOrSlug[]): void;
    setModifiers(modifiers: SlugifiedEntryOrSlug | SlugifiedEntryOrSlug[]): void;
    toJSON(): DFTModelSchema & AnyObject;
    get allFunctionals(): SlugifiedEntry[];
    get allRefiners(): SlugifiedEntry[];
    get allModifiers(): SlugifiedEntry[];
}
