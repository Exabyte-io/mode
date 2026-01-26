"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MLTrainTestSplitContextProvider = void 0;

var _ade = require("@exabyte-io/ade.js");

var _context = require("@exabyte-io/code.js/dist/context");

var _mixwith = require("mixwith");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MLTrainTestSplitContextProvider extends (0, _mixwith.mix)(_context.ContextProvider).with(_context.ApplicationContextMixin) {
  // eslint-disable-next-line class-methods-use-this
  get uiSchema() {
    return {
      target_column_name: {},
      problem_category: {}
    };
  } // eslint-disable-next-line class-methods-use-this


  get defaultData() {
    return {
      fraction_held_as_test_set: 0.2
    };
  }

  get jsonSchema() {
    return {
      $schema: "http://json-schema.org/draft-04/schema#",
      title: " ",
      description: "Fraction held as the test set. For example, a value of 0.2 corresponds to an 80/20 train/test split.",
      type: "object",
      properties: {
        fraction_held_as_test_set: {
          type: "number",
          default: this.defaultData.fraction_held_as_test_set,
          minimum: 0,
          maximum: 1
        }
      }
    };
  }

}

exports.MLTrainTestSplitContextProvider = MLTrainTestSplitContextProvider;

_defineProperty(MLTrainTestSplitContextProvider, "Application", _ade.Application);