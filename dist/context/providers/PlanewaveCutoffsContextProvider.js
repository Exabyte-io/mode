"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlanewaveCutoffsContextProvider = void 0;

var _ade = require("@exabyte-io/ade.js");

var _context = require("@exabyte-io/code.js/dist/context");

var _mixwith = require("mixwith");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const cutoffConfig = {
  vasp: {},
  // assuming default cutoffs for VASP
  espresso: {
    // assuming the default GBRV set of pseudopotentials is used
    wavefunction: 40,
    density: 200
  }
};

class PlanewaveCutoffsContextProvider extends (0, _mixwith.mix)(_context.ContextProvider).with(_context.ApplicationContextMixin) {
  // eslint-disable-next-line class-methods-use-this
  get uiSchema() {
    return {
      wavefunction: {},
      density: {}
    };
  }

  get defaultData() {
    return {
      wavefunction: this.defaultECUTWFC,
      density: this.defaultECUTRHO
    };
  }

  get _cutoffConfigPerApplication() {
    return cutoffConfig[this.application.name];
  }

  get defaultECUTWFC() {
    return this._cutoffConfigPerApplication.wavefunction || null;
  }

  get defaultECUTRHO() {
    return this._cutoffConfigPerApplication.density || null;
  }

  get jsonSchema() {
    return {
      $schema: "http://json-schema.org/draft-04/schema#",
      title: " ",
      description: "Planewave cutoff parameters for electronic wavefunctions and density. Units are specific to simulation engine.",
      type: "object",
      properties: {
        wavefunction: {
          type: "number",
          default: this.defaultECUTWFC
        },
        density: {
          type: "number",
          default: this.defaultECUTRHO
        }
      }
    };
  }

}

exports.PlanewaveCutoffsContextProvider = PlanewaveCutoffsContextProvider;

_defineProperty(PlanewaveCutoffsContextProvider, "Application", _ade.Application);