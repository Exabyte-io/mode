import lodash from "lodash";

import { MODEL_NAMES, MODEL_TREE } from "./tree";
import type { MethodConfig, ModelDescriptor, NamedSlug } from "./types";

export const PseudopotentialMethodConfig: MethodConfig = {
    type: "pseudopotential",
    subtype: "us",
};

export const LocalOrbitalMethodConfig: MethodConfig = {
    type: "localorbital",
    subtype: "pople",
};

export const UnknownMethodConfig: MethodConfig = {
    type: "unknown",
    subtype: "unknown",
};

const mapSlugToNamedObject = (slug: string): NamedSlug => {
    return {
        slug,
        name: lodash.get(MODEL_NAMES, slug, slug),
    };
};

export function allowedTypes(model: ModelDescriptor): NamedSlug[] {
    const branch = lodash.get(MODEL_TREE, `${model.type}.${model.subtype}.methods`, {});
    return lodash.keys(branch).map(mapSlugToNamedObject);
}

export function allowedSubtypes(model: ModelDescriptor, type: string): NamedSlug[] {
    const branch = lodash.get(
        MODEL_TREE,
        `${model.type}.${model.subtype}.methods.${type}`,
        [],
    );
    return (branch as string[]).map(mapSlugToNamedObject);
}

