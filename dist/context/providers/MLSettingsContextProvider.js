"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MLSettingsContextProvider = void 0;

var _ade = require("@exabyte-io/ade.js");

var _context = require("@exabyte-io/code.js/dist/context");

var _mixwith = require("mixwith");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MLSettingsContextProvider extends (0, _mixwith.mix)(_context.ContextProvider).with(_context.ApplicationContextMixin) {
  // eslint-disable-next-line class-methods-use-this
  get uiSchema() {
    return {
      target_column_name: {},
      problem_category: {}
    };
  } // eslint-disable-next-line class-methods-use-this


  get defaultData() {
    return {
      target_column_name: "target",
      problem_category: "regression"
    };
  }

  get jsonSchema() {
    return {
      $schema: "http://json-schema.org/draft-04/schema#",
      title: " ",
      description: "Settings important to machine learning runs.",
      type: "object",
      properties: {
        target_column_name: {
          type: "string",
          default: this.defaultData.target_column_name
        },
        problem_category: {
          type: "string",
          default: this.defaultData.problem_category,
          enum: ["regression", "classification", "clustering"]
        }
      }
    };
  }

}

exports.MLSettingsContextProvider = MLSettingsContextProvider;

_defineProperty(MLSettingsContextProvider, "Application", _ade.Application);