"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.MethodFactory = void 0;
var _method = require("../method");
var _pseudopotential = require("./pseudopotential");
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
class MethodFactory {
    static create(config) {
        switch (config.type) {
            case "pseudopotential":
                return new this.PseudopotentialMethod(config);
            default:
                return new this.Method(config);
        }
    }
}
exports.MethodFactory = MethodFactory;
_defineProperty(MethodFactory, "Method", _method.Method);
_defineProperty(MethodFactory, "PseudopotentialMethod", _pseudopotential.PseudopotentialMethod);
