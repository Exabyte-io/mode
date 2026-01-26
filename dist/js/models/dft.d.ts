import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import { type BaseModel, SlugifiedEntry, SlugifiedEntryOrSlug } from "@mat3ra/esse/dist/js/types";
import { MethodFactory } from "../methods/factory";
import { Model } from "../model";
import type { ModelConfig } from "../types";
export declare class DFTModel extends Model {
    constructor(config: ModelConfig & {
        MethodFactory?: typeof MethodFactory;
    });
    get groupSlug(): string;
    get defaultFunctional(): SlugifiedEntry;
    get defaultRefiners(): SlugifiedEntry[];
    get defaultModifiers(): SlugifiedEntry[];
    get functional(): SlugifiedEntry;
    get refiners(): SlugifiedEntry[];
    get modifiers(): SlugifiedEntry[];
    setSubtype(subtype: SlugifiedEntryOrSlug): void;
    setFunctional(functional: SlugifiedEntryOrSlug): void;
    private _setArrayProp;
    setRefiners(refiners: SlugifiedEntryOrSlug | SlugifiedEntryOrSlug[]): void;
    setModifiers(modifiers: SlugifiedEntryOrSlug | SlugifiedEntryOrSlug[]): void;
    toJSON(): BaseModel & AnyObject;
    get allFunctionals(): SlugifiedEntry[];
    get allRefiners(): SlugifiedEntry[];
    get allModifiers(): SlugifiedEntry[];
}
