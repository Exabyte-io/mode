"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoundaryConditionsFormDataProvider = void 0;

var _context = require("@exabyte-io/code.js/dist/context");

var _utils = require("@exabyte-io/code.js/dist/utils");

var _made = require("@exabyte-io/made.js");

var _mixwith = require("mixwith");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BoundaryConditionsFormDataProvider extends (0, _mixwith.mix)(_context.JSONSchemaFormDataProvider).with(_context.MaterialContextMixin) {
  get boundaryConditions() {
    return this.material.metadata.boundaryConditions || {};
  } // eslint-disable-next-line class-methods-use-this


  get defaultData() {
    return {
      type: this.boundaryConditions.type || "pbc",
      offset: this.boundaryConditions.offset || 0,
      electricField: 0,
      targetFermiEnergy: 0
    };
  } // eslint-disable-next-line class-methods-use-this


  get uiSchema() {
    return {
      type: {
        "ui:disabled": true
      },
      offset: {
        "ui:disabled": true
      },
      electricField: {},
      targetFermiEnergy: {}
    };
  } // eslint-disable-next-line class-methods-use-this


  get humanName() {
    return "Boundary Conditions";
  }

  yieldDataForRendering() {
    const data = (0, _utils.deepClone)(this.yieldData());
    data.boundaryConditions.offset *= _made.Made.coefficients.ANGSTROM_TO_BOHR;
    data.boundaryConditions.targetFermiEnergy *= _made.Made.coefficients.EV_TO_RY;
    data.boundaryConditions.electricField *= _made.Made.coefficients.EV_A_TO_RY_BOHR;
    return data;
  }

  get jsonSchema() {
    return {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        type: {
          type: "string",
          title: "Type",
          default: this.defaultData.type
        },
        offset: {
          type: "number",
          title: "Offset (A)",
          default: this.defaultData.offset
        },
        electricField: {
          type: "number",
          title: "Electric Field (eV/A)",
          default: this.defaultData.electricField
        },
        targetFermiEnergy: {
          type: "number",
          title: "Target Fermi Energy (eV)",
          default: this.defaultData.targetFermiEnergy
        }
      }
    };
  }

}

exports.BoundaryConditionsFormDataProvider = BoundaryConditionsFormDataProvider;

_defineProperty(BoundaryConditionsFormDataProvider, "Material", _made.Made.Material);