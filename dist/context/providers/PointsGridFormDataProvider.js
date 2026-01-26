"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PointsGridFormDataProvider = void 0;

var _context = require("@exabyte-io/code.js/dist/context");

var _made = require("@exabyte-io/made.js");

var _lodash = _interopRequireDefault(require("lodash"));

var _mixwith = require("mixwith");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO : pass appSettings to use defaultKPPRA
class PointsGridFormDataProvider extends (0, _mixwith.mix)(_context.JSONSchemaFormDataProvider).with(_context.MaterialContextMixin) {
  constructor(config) {
    super(config);
    this._divisor = config.divisor || 1; // KPPRA will be divided by this number

    this.dimensions = _lodash.default.get(this.data, "dimensions") || this._defaultDimensions;
    this.shifts = _lodash.default.get(this.data, "shifts") || this._defaultShifts; // init class fields from data (as constructed from context in parent)

    this.KPPRA = _lodash.default.get(this.data, "KPPRA") || this._defaultKPPRA;
    this.preferKPPRA = _lodash.default.get(this.data, "preferKPPRA", false);
  }

  getDefaultDimension() {
    return this._getGridFromKPPRA(this._defaultKPPRA).dimensions[0];
  } // eslint-disable-next-line class-methods-use-this


  getDefaultShift() {
    return 0;
  } // eslint-disable-next-line class-methods-use-this


  get _defaultDimensions() {
    return Array(3).fill(this.getDefaultDimension());
  } // eslint-disable-next-line class-methods-use-this


  get _defaultShifts() {
    return Array(3).fill(this.getDefaultShift());
  }

  get _defaultKPPRA() {
    return Math.floor(10 / this._divisor);
  }

  get jsonSchema() {
    const kOrQ = this.name[0];
    const vector = {
      type: "array",
      items: {
        type: "number"
      },
      minItems: 3,
      maxItems: 3
    };

    const vector_ = defaultValue => {
      return { ...vector,
        items: {
          type: this.isUsingJinjaVariables ? "string" : "number",
          default: defaultValue
        }
      };
    };

    return {
      $schema: "http://json-schema.org/draft-04/schema#",
      description: `3D grid with shifts. Default min value for ${kOrQ.toUpperCase()}PPRA (${kOrQ}pt per reciprocal atom) is ${this._defaultKPPRA}.`,
      type: "object",
      properties: {
        dimensions: vector_(this.getDefaultDimension()),
        shifts: vector_(this.getDefaultShift()),
        KPPRA: {
          type: "integer",
          minimum: 1,
          default: this.KPPRA
        },
        preferKPPRA: {
          type: "boolean",
          default: this.preferKPPRA
        }
      },
      required: ["dimensions", "shifts"]
    };
  }

  _arraySubStyle(emptyValue = 0) {
    return {
      "ui:options": {
        addable: false,
        orderable: false,
        removable: false
      },
      items: {
        "ui:disabled": this.preferKPPRA,
        // TODO: extract the actual current values from context
        "ui:placeholder": "1",
        "ui:emptyValue": emptyValue
      }
    };
  }

  get uiSchema() {
    return {
      dimensions: this._arraySubStyle(1),
      shifts: this._arraySubStyle(0),
      KPPRA: {
        "ui:disabled": !this.preferKPPRA,
        "ui:emptyValue": this.KPPRA,
        "ui:placeholder": this.KPPRA.toString() // make string to prevent prop type error

      },
      preferKPPRA: { ...this.fieldStyles("p-t-20"),
        // add padding top to level with other elements
        "ui:emptyValue": true
      }
    };
  }

  get _defaultData() {
    return {
      dimensions: this._defaultDimensions,
      shifts: this._defaultShifts,
      KPPRA: this._defaultKPPRA,
      preferKPPRA: false
    };
  }

  get _defaultDataWithMaterial() {
    // if `data` is present and material is updated, prioritize `data` when `preferKPPRA` is not set
    return this.preferKPPRA ? this._getGridFromKPPRA(this.KPPRA) : this.data || this._defaultData;
  }

  get defaultData() {
    return this.material ? this._defaultDataWithMaterial : this._defaultData;
  }

  _getGridFromKPPRA(KPPRA) {
    const nAtoms = this.material ? this.material.Basis.nAtoms : 1;
    const dimension = Math.ceil((KPPRA / nAtoms) ** (1 / 3));
    return {
      dimensions: Array(3).fill(dimension),
      shifts: this._defaultShifts
    };
  }

  _getKPPRAFromGrid(grid = this.defaultData) {
    const nAtoms = this.material ? this.material.Basis.nAtoms : 1;
    return grid.dimensions.reduce((a, b) => a * b) * nAtoms;
  }

  static _canTransform(data) {
    return data.preferKPPRA && data.KPPRA || !data.preferKPPRA && data.dimensions.every(d => typeof d === "number");
  }

  transformData(data) {
    if (!PointsGridFormDataProvider._canTransform(data)) {
      return data;
    } // 1. check if KPPRA is preferred


    if (data.preferKPPRA) {
      // 2. KPPRA is preferred => recalculate grid; NOTE: `data.KPPRA` is undefined at first
      data.dimensions = this._getGridFromKPPRA(data.KPPRA).dimensions;
    } else {
      // 3. KPPRA is not preferred => grid was => recalculate KPPRA
      data.KPPRA = this._getKPPRAFromGrid(data);
    }

    return data;
  }

}

exports.PointsGridFormDataProvider = PointsGridFormDataProvider;

_defineProperty(PointsGridFormDataProvider, "Material", _made.Made.Material);