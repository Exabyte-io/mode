import { BaseModel, SlugifiedEntry } from "@mat3ra/esse/dist/js/types";
export declare const PseudopotentialMethodConfig: {
    readonly type: "pseudopotential";
    readonly subtype: "us";
};
export declare const LocalOrbitalMethodConfig: {
    readonly type: "localorbital";
    readonly subtype: "pople";
};
export declare const UnknownMethodConfig: {
    readonly type: "unknown";
    readonly subtype: "unknown";
};
export declare const methodConfigs: {
    readonly pseudopotential: {
        readonly type: "pseudopotential";
        readonly subtype: "us";
    };
    readonly localorbital: {
        readonly type: "localorbital";
        readonly subtype: "pople";
    };
    readonly unknown: {
        readonly type: "unknown";
        readonly subtype: "unknown";
    };
};
export declare function allowedTypes(model: Pick<BaseModel, "type" | "subtype">): SlugifiedEntry[];
export declare function allowedSubtypes(model: Pick<BaseModel, "type" | "subtype">, type: string): SlugifiedEntry[];
