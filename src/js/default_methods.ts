import { BaseMethod, SlugifiedEntry } from "@mat3ra/esse/dist/js/types";
import lodash from "lodash";

import { MODEL_NAMES, MODEL_TREE } from "./tree";
import type { ModelDescriptor } from "./types";

export const PseudopotentialMethodConfig: BaseMethod = {
    type: "pseudopotential",
    subtype: "us",
};

export const LocalOrbitalMethodConfig: BaseMethod = {
    type: "localorbital",
    subtype: "pople",
};

export const UnknownMethodConfig: BaseMethod = {
    type: "unknown",
    subtype: "unknown",
};

const mapSlugToNamedObject = (slug: string): SlugifiedEntry => {
    return {
        slug,
        name: lodash.get(MODEL_NAMES, slug, slug),
    };
};

export function allowedTypes(model: ModelDescriptor): SlugifiedEntry[] {
    const branch = lodash.get(MODEL_TREE, `${model.type}.${model.subtype}.methods`, {});
    return lodash.keys(branch).map(mapSlugToNamedObject);
}

export function allowedSubtypes(model: ModelDescriptor, type: string): SlugifiedEntry[] {
    const branch = lodash.get(MODEL_TREE, `${model.type}.${model.subtype}.methods.${type}`, []);
    return (branch as string[]).map(mapSlugToNamedObject);
}
