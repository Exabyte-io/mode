import { BaseMethod, BaseModel, SlugifiedEntry } from "@mat3ra/esse/dist/js/types";
export declare const PseudopotentialMethodConfig: BaseMethod;
export declare const LocalOrbitalMethodConfig: BaseMethod;
export declare const UnknownMethodConfig: BaseMethod;
export declare function allowedTypes(model: Pick<BaseModel, "type" | "subtype">): SlugifiedEntry[];
export declare function allowedSubtypes(model: Pick<BaseModel, "type" | "subtype">, type: string): SlugifiedEntry[];
