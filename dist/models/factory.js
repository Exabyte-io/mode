"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelFactory = void 0;

var _model = require("../model");

var _tree = require("../tree");

var _dft = require("./dft");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    const {
      application
    } = config;
    const type = application && (0, _tree.getDefaultModelTypeForApplication)(application);
    if (!type) throw new Error(`ModelFactory.createFromApplication: cannot determine model type: ${type}`);
    return this.create({ ...config,
      type
    });
  }

}

exports.ModelFactory = ModelFactory;

_defineProperty(ModelFactory, "DFTModel", _dft.DFTModel);

_defineProperty(ModelFactory, "Model", _model.Model);