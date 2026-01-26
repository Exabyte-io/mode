"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MethodFactory = void 0;

var _method = require("../method");

var _pseudopotential = require("./pseudopotential");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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