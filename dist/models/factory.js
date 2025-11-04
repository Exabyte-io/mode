"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.ModelFactory = void 0;
var _model = require("../model");
var _tree = require("../tree");
var _dft = require("./dft");
function _defineProperty(e, r, t) {
    return (
        (r = _toPropertyKey(r)) in e
            ? Object.defineProperty(e, r, {
                  value: t,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
              })
            : (e[r] = t),
        e
    );
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
class ModelFactory {
    static create(config) {
        switch (config.type) {
            case "dft":
                return new this.DFTModel(config);
            default:
                return new this.Model(config);
        }
    }
    static createFromApplication(config) {
        const { application } = config;
        const type = application && (0, _tree.getDefaultModelTypeForApplication)(application);
        if (!type)
            throw new Error(
                `ModelFactory.createFromApplication: cannot determine model type: ${type}`,
            );
        return this.create({
            ...config,
            type,
        });
    }
}
exports.ModelFactory = ModelFactory;
_defineProperty(ModelFactory, "DFTModel", _dft.DFTModel);
_defineProperty(ModelFactory, "Model", _model.Model);
