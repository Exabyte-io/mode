"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PointsPathFormDataProvider = exports.ExplicitPointsPathFormDataProvider = exports.ExplicitPointsPath2PIBAFormDataProvider = void 0;

var _ade = require("@exabyte-io/ade.js");

var _context = require("@exabyte-io/code.js/dist/context");

var _math = require("@exabyte-io/code.js/dist/math");

var _made = require("@exabyte-io/made.js");

var _mixwith = require("mixwith");

var _underscore = _interopRequireDefault(require("underscore.string"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const defaultPoint = "Г";
const defaultSteps = 10;

class PointsPathFormDataProvider extends (0, _mixwith.mix)(_context.JSONSchemaFormDataProvider).with(_context.ApplicationContextMixin, _context.MaterialContextMixin) {
  constructor(config) {
    super(config);
    this.reciprocalLattice = new _made.Made.ReciprocalLattice(this.material.lattice);
    this.symmetryPoints = this.symmetryPointsFromMaterial;
  }

  get isEditedIsSetToFalseOnMaterialUpdate() {
    return this.isMaterialUpdated || this.isMaterialCreatedDefault;
  }

  get defaultData() {
    return this.reciprocalLattice.defaultKpointPath;
  }

  get symmetryPointsFromMaterial() {
    return this.reciprocalLattice.symmetryPoints;
  }

  get jsonSchema() {
    // no need to pass context to get symmetry points on client
    const points = [].concat(this.symmetryPoints).map(x => x.point);
    return {
      $schema: "http://json-schema.org/draft-04/schema#",
      title: " ",
      description: "path in reciprocal space",
      type: "array",
      items: {
        type: "object",
        properties: {
          point: {
            type: "string",
            default: defaultPoint,
            enum: points
          },
          steps: {
            type: "integer",
            default: defaultSteps
          }
        }
      },
      minItems: 1
    };
  } // eslint-disable-next-line class-methods-use-this


  get uiSchema() {
    return {
      items: {}
    };
  }

  get uiSchemaStyled() {
    return {
      items: {
        point: this.defaultFieldStyles,
        steps: this.defaultFieldStyles
      }
    };
  }

  get fields() {
    const hasRequiredFn = typeof this.material.getBrillouinZoneImageComponent === "function";

    if (!hasRequiredFn) {
      console.log("PointsPathFormDataProvider: Material class has no function" + " 'getBrillouinZoneImageComponent'! Returning empty Object instead.");
      return {};
    }

    return {
      // eslint-disable-next-line no-unused-vars
      TitleField: ({
        title,
        // eslint-disable-next-line no-unused-vars
        required
      }) => this.material.getBrillouinZoneImageComponent(title)
    };
  }

  get useExplicitPath() {
    return this.application.name === "vasp";
  } // override yieldData to avoid storing explicit path in saved context


  yieldDataForRendering() {
    return this.yieldData(this.useExplicitPath);
  }

  transformData(path = [], useExplicitPath = false) {
    const rawData = path.map(p => {
      const point = this.symmetryPoints.find(sp => sp.point === p.point);
      return { ...p,
        coordinates: point.coordinates
      };
    });
    const processedData = useExplicitPath ? this._convertToExplicitPath(rawData) : rawData; // make coordinates into string and add formatting

    return processedData.map(p => {
      const coordinates = this.is2PIBA ? this.get2PIBACoordinates(p.coordinates) : p.coordinates;
      p.coordinates = coordinates.map(c => _underscore.default.sprintf("%14.9f", c));
      return p;
    });
  }

  get2PIBACoordinates(point) {
    return this.reciprocalLattice.getCartesianCoordinates(point);
  } // Initially, path contains symmetry points with steps counts.
  // This function explicitly calculates each point between symmetry points by step counts.
  // eslint-disable-next-line class-methods-use-this


  _convertToExplicitPath(path) {
    const points = [];

    for (let i = 0; i < path.length - 1; i++) {
      const startPoint = path[i];
      const endPoint = path[i + 1];

      const middlePoints = _math.math.calculateSegmentsBetweenPoints3D(startPoint.coordinates, endPoint.coordinates, startPoint.steps);

      points.push(startPoint.coordinates);
      points.push(...middlePoints); // Include endPoint into path for the last section, otherwise it will be included by next loop iteration

      if (path.length - 2 === i) points.push(endPoint.coordinates);
    }

    return points.map(x => {
      return {
        coordinates: x,
        steps: 1
      };
    });
  }

}

exports.PointsPathFormDataProvider = PointsPathFormDataProvider;

_defineProperty(PointsPathFormDataProvider, "Material", _made.Made.Material);

_defineProperty(PointsPathFormDataProvider, "Application", _ade.Application);

class ExplicitPointsPathFormDataProvider extends PointsPathFormDataProvider {
  // eslint-disable-next-line class-methods-use-this
  get useExplicitPath() {
    return true;
  }

}

exports.ExplicitPointsPathFormDataProvider = ExplicitPointsPathFormDataProvider;

class ExplicitPointsPath2PIBAFormDataProvider extends ExplicitPointsPathFormDataProvider {
  // eslint-disable-next-line class-methods-use-this
  get is2PIBA() {
    return true;
  }

}

exports.ExplicitPointsPath2PIBAFormDataProvider = ExplicitPointsPath2PIBAFormDataProvider;