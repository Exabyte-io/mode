import lodash from "lodash";

import { MODEL_NAMES, MODEL_TREE } from "./tree";

export const PseudopotentialMethodConfig = {
    type: "pseudopotential",
    subtype: "us",
};

export const LocalOrbitalMethodConfig = {
    type: "localorbital",
    subtype: "pople",
};

export const UnknownMethodConfig = {
    type: "unknown",
    subtype: "unknown",
};

export function allowedTypes(model) {
    return lodash
        .keys(lodash.get(MODEL_TREE, `${model.type}.${model.subtype}.methods`, []))
        .map((x) => {
            return {
                slug: x,
                name: lodash.get(MODEL_NAMES, x, x),
            };
        });
}

export function allowedSubtypes(model, type) {
    return lodash.get(MODEL_TREE, `${model.type}.${model.subtype}.methods.${type}`, []).map((x) => {
        return {
            slug: x,
            name: lodash.get(MODEL_NAMES, x, x),
        };
    });
}
