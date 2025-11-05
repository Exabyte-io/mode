"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownMethodConfig = exports.LocalOrbitalMethodConfig = exports.PseudopotentialMethodConfig = void 0;
exports.allowedTypes = allowedTypes;
exports.allowedSubtypes = allowedSubtypes;
const lodash_1 = __importDefault(require("lodash"));
const tree_1 = require("./tree");
exports.PseudopotentialMethodConfig = {
    type: "pseudopotential",
    subtype: "us",
};
exports.LocalOrbitalMethodConfig = {
    type: "localorbital",
    subtype: "pople",
};
exports.UnknownMethodConfig = {
    type: "unknown",
    subtype: "unknown",
};
const mapSlugToNamedObject = (slug) => {
    return {
        slug,
        name: lodash_1.default.get(tree_1.MODEL_NAMES, slug, slug),
    };
};
function allowedTypes(model) {
    const branch = lodash_1.default.get(tree_1.MODEL_TREE, `${model.type}.${model.subtype}.methods`, {});
    return lodash_1.default.keys(branch).map(mapSlugToNamedObject);
}
function allowedSubtypes(model, type) {
    const branch = lodash_1.default.get(tree_1.MODEL_TREE, `${model.type}.${model.subtype}.methods.${type}`, []);
    return branch.map(mapSlugToNamedObject);
}
