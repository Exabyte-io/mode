import { BaseModel, SlugifiedEntry } from "@mat3ra/esse/dist/js/types";
import lodash from "lodash";

import { MODEL_NAMES, MODEL_TREE } from "./tree";

export const PseudopotentialMethodConfig = {
    type: "pseudopotential",
    subtype: "us",
} as const;

export const LocalOrbitalMethodConfig = {
    type: "localorbital",
    subtype: "pople",
} as const;

export const UnknownMethodConfig = {
    type: "unknown",
    subtype: "unknown",
} as const;

const mapSlugToNamedObject = (slug: string): SlugifiedEntry => {
    return {
        slug,
        name: lodash.get(MODEL_NAMES, slug, slug),
    };
};

export function allowedTypes(model: Pick<BaseModel, "type" | "subtype">): SlugifiedEntry[] {
    const branch = lodash.get(MODEL_TREE, `${model.type}.${model.subtype}.methods`, {});
    return lodash.keys(branch).map(mapSlugToNamedObject);
}

export function allowedSubtypes(
    model: Pick<BaseModel, "type" | "subtype">,
    type: string,
): SlugifiedEntry[] {
    const branch = lodash.get(MODEL_TREE, `${model.type}.${model.subtype}.methods.${type}`, []);
    return (branch as string[]).map(mapSlugToNamedObject);
}
