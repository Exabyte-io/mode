"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnknownMethodConfig = exports.PseudopotentialMethodConfig = exports.LocalOrbitalMethodConfig = void 0;
exports.allowedSubtypes = allowedSubtypes;
exports.allowedTypes = allowedTypes;

var _lodash = _interopRequireDefault(require("lodash"));

var _tree = require("./tree");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PseudopotentialMethodConfig = {
  type: "pseudopotential",
  subtype: "us"
};
exports.PseudopotentialMethodConfig = PseudopotentialMethodConfig;
const LocalOrbitalMethodConfig = {
  type: "localorbital",
  subtype: "pople"
};
exports.LocalOrbitalMethodConfig = LocalOrbitalMethodConfig;
const UnknownMethodConfig = {
  type: "unknown",
  subtype: "unknown"
};
exports.UnknownMethodConfig = UnknownMethodConfig;

function allowedTypes(model) {
  return _lodash.default.keys(_lodash.default.get(_tree.MODEL_TREE, `${model.type}.${model.subtype}.methods`, [])).map(x => {
    return {
      slug: x,
      name: _lodash.default.get(_tree.MODEL_NAMES, x, x)
    };
  });
}

function allowedSubtypes(model, type) {
  return _lodash.default.get(_tree.MODEL_TREE, `${model.type}.${model.subtype}.methods.${type}`, []).map(x => {
    return {
      slug: x,
      name: _lodash.default.get(_tree.MODEL_NAMES, x, x)
    };
  });
}