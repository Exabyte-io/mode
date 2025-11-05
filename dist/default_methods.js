"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.UnknownMethodConfig =
    exports.PseudopotentialMethodConfig =
    exports.LocalOrbitalMethodConfig =
        void 0;
exports.allowedSubtypes = allowedSubtypes;
exports.allowedTypes = allowedTypes;
var _lodash = _interopRequireDefault(require("lodash"));
var _tree = require("./tree");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
}
const PseudopotentialMethodConfig = (exports.PseudopotentialMethodConfig = {
    type: "pseudopotential",
    subtype: "us",
});
const LocalOrbitalMethodConfig = (exports.LocalOrbitalMethodConfig = {
    type: "localorbital",
    subtype: "pople",
});
const UnknownMethodConfig = (exports.UnknownMethodConfig = {
    type: "unknown",
    subtype: "unknown",
});
function allowedTypes(model) {
    return _lodash.default
        .keys(_lodash.default.get(_tree.MODEL_TREE, `${model.type}.${model.subtype}.methods`, []))
        .map((x) => {
            return {
                slug: x,
                name: _lodash.default.get(_tree.MODEL_NAMES, x, x),
            };
        });
}
function allowedSubtypes(model, type) {
    return _lodash.default
        .get(_tree.MODEL_TREE, `${model.type}.${model.subtype}.methods.${type}`, [])
        .map((x) => {
            return {
                slug: x,
                name: _lodash.default.get(_tree.MODEL_NAMES, x, x),
            };
        });
}
