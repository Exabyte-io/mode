"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODEL_TREE = exports.MODEL_NAMES = exports.METHODS = void 0;
exports.filterMethodsByModel = filterMethodsByModel;
exports.treeSlugToNamedObject = exports.getTreeByApplicationNameAndVersion = exports.getPseudopotentialTypesFromTree = exports.getDefaultModelTypeForApplication = exports.getDFTFunctionalsFromTree = exports.getDFTFunctionalsByApproximation = void 0;

var _utils = require("@exabyte-io/code.js/dist/utils");

var _lodash = _interopRequireDefault(require("lodash"));

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: reactivate once build script is included in postinstall again
// import modelMethodMap from "../model_method_map";
// TODO: migrate to use manifest instead
const METHODS = {
  pseudopotential: "pseudopotential",
  localorbital: "localorbital",
  unknown: "unknown"
};
exports.METHODS = METHODS;
const methods = {
  [METHODS.pseudopotential]: ["paw", "nc", "us"],
  // TODO: Add additional basis set options, once user choice of specific (i.e 3-21G vs cc-pVDZ) is implemented.
  [METHODS.localorbital]: ["pople"],
  [METHODS.unknown]: ["unknown"]
};

const getPseudopotentialTypesFromTree = () => methods[METHODS.pseudopotential]; // DFT-specific


exports.getPseudopotentialTypesFromTree = getPseudopotentialTypesFromTree;
const DFTModelRefiners = ["hse", "g0w0"];
const DFTModelModifiers = ["soc", "magn"];
const DFTModelTree = {
  gga: {
    refiners: DFTModelRefiners,
    modifiers: DFTModelModifiers,
    methods,
    functionals: ["pbe", "pbesol", "pw91", "other"]
  },
  lda: {
    refiners: DFTModelRefiners,
    modifiers: DFTModelModifiers,
    methods,
    functionals: ["pz", "pw", "vwn", "other"]
  },
  other: {
    methods,
    functionals: ["other"]
  }
};

const getDFTFunctionalsFromTree = () => Object.keys(DFTModelTree);

exports.getDFTFunctionalsFromTree = getDFTFunctionalsFromTree;

const getDFTFunctionalsByApproximation = approximation => {
  const branch = DFTModelTree[approximation];
  return branch && branch.functionals;
}; // GENERAL


exports.getDFTFunctionalsByApproximation = getDFTFunctionalsByApproximation;
const MODEL_TREE = {
  dft: DFTModelTree,
  ml: {
    re: {
      methods: {
        linear: ["least_squares", "ridge"],
        kernel_ridge: ["least_squares"]
      }
    }
  },
  unknown: {
    unknown: {
      methods: {
        unknown: ["unknown"]
      }
    }
  }
};
exports.MODEL_TREE = MODEL_TREE;
const MODEL_NAMES = {
  dft: "density functional theory",
  lda: "local density approximation",
  gga: "generalized gradient approximation",
  ml: "machine learning",
  re: "regression"
};
exports.MODEL_NAMES = MODEL_NAMES;

const treeSlugToNamedObject = modelSlug => {
  return {
    slug: modelSlug,
    name: _lodash.default.get(MODEL_NAMES, modelSlug, modelSlug)
  };
}; // TODO: find a better way to handle application-specific model-method combination
// must be a subset of the MODEL_TREE above
// demonstrate how tree can be modified
// VASP_MODELS_TREE.gga.functionals = _.omit(VASP_MODELS_TREE.gga.functionals);


exports.treeSlugToNamedObject = treeSlugToNamedObject;
const VASP_MODELS_TREE = (0, _utils.deepClone)(_underscore.default.pick(MODEL_TREE, "dft"));
const ESPRESSO_MODELS_TREE = (0, _utils.deepClone)(_underscore.default.pick(MODEL_TREE, "dft"));
const NWCHEM_MODELS_TREE = (0, _utils.deepClone)(_underscore.default.pick(MODEL_TREE, "dft"));
["gga", "lda"].forEach(approximation => {
  // pick "paw" for vasp
  VASP_MODELS_TREE.dft[approximation].methods.pseudopotential = VASP_MODELS_TREE.dft[approximation].methods.pseudopotential.splice(0, 1); // assert "us" is the first option

  ESPRESSO_MODELS_TREE.dft[approximation].methods.pseudopotential = ESPRESSO_MODELS_TREE.dft[approximation].methods.pseudopotential.reverse(); // NWCHEM_MODELS_TREE.dft[approximation].methods.localorbital =
  //     NWCHEM_MODELS_TREE.dft[approximation].methods.localorbital;
});

const UNKNOWN_MODELS_TREE = _underscore.default.pick(MODEL_TREE, "unknown");

const ML_MODELS_TREE = _underscore.default.pick(MODEL_TREE, "ml");

const MODELS_TREE_CONFIGS_BY_APPLICATION_NAME_VERSION = [{
  name: "vasp",
  tree: VASP_MODELS_TREE
}, {
  name: "espresso",
  tree: ESPRESSO_MODELS_TREE
}, {
  name: "python",
  tree: UNKNOWN_MODELS_TREE
}, {
  name: "shell",
  tree: UNKNOWN_MODELS_TREE
}, {
  name: "exabyteml",
  tree: ML_MODELS_TREE
}, {
  name: "jupyterLab",
  tree: UNKNOWN_MODELS_TREE
}, {
  name: "nwchem",
  tree: NWCHEM_MODELS_TREE
}];

const getTreeByApplicationNameAndVersion = ({
  name,
  // eslint-disable-next-line no-unused-vars
  version
}) => {
  // TODO: add logic to filter by version when necessary
  const cfgs = MODELS_TREE_CONFIGS_BY_APPLICATION_NAME_VERSION.filter(cfg => cfg.name === name).map(x => x.tree);
  return Object.assign({}, ...cfgs);
};

exports.getTreeByApplicationNameAndVersion = getTreeByApplicationNameAndVersion;

const getDefaultModelTypeForApplication = application => {
  return Object.keys(getTreeByApplicationNameAndVersion(application))[0];
}; // TODO: remove once model-method map is imported from script-generated file


exports.getDefaultModelTypeForApplication = getDefaultModelTypeForApplication;
const modelMethodMap = {
  pb: {
    qm: {
      dft: {
        ksdft: {
          lda: [{
            path: "/qm/wf/none/pw/none"
          }, {
            regex: "/qm/wf/none/psp/.*"
          }, {
            regex: "/qm/wf/none/smearing/.*"
          }, {
            regex: "/qm/wf/none/tetrahedron/.*"
          }, {
            path: "/opt/diff/ordern/cg/none"
          }, {
            path: "/linalg/diag/none/davidson/none"
          }]
        }
      }
    }
  }
};
/**
 * Create list of filter objects based on model categories.
 * @param {Object} filterTree - filter tree constructed from assets
 * @param {string} tier1 - Level 1 tier
 * @param {string} tier2 - Level 2 tier
 * @param {string} tier3 - Level 3 tier
 * @param {string} type - Type
 * @param {string} subtype - Subtype
 * @return {*[]}
 */

function getMethodFilterObjects({
  filterTree,
  tier1,
  tier2,
  tier3,
  type,
  subtype
}) {
  let filterList;

  if (!tier1) {
    filterList = (0, _utils.mergeTerminalNodes)(filterTree);
  } else if (!tier2) {
    filterList = (0, _utils.mergeTerminalNodes)(filterTree[tier1]);
  } else if (!tier3) {
    filterList = (0, _utils.mergeTerminalNodes)(filterTree[tier1][tier2]);
  } else if (!type) {
    filterList = (0, _utils.mergeTerminalNodes)(filterTree[tier1][tier2][tier3]);
  } else if (!subtype) {
    filterList = (0, _utils.mergeTerminalNodes)(filterTree[tier1][tier2][tier3][type]);
  } else {
    filterList = filterTree[tier1][tier2][tier3][type][subtype];
  }

  const extractUniqueBy = name => {
    return _lodash.default.chain(filterList).filter(o => Boolean(o[name])).uniqBy(name).value();
  };

  return [].concat(extractUniqueBy("path"), extractUniqueBy("regex"));
}
/**
 * Filter list of method configs based on model
 * @param {Object[]} methodList - Array of method configs
 * @param {Object} model - Model config for which methods should be filtered
 * @return {Object[]}
 */


function filterMethodsByModel({
  methodList,
  model
}) {
  const {
    categories
  } = model;
  const filterObjects = getMethodFilterObjects({
    filterTree: modelMethodMap,
    ...categories
  });
  return (0, _utils.filterEntityList)({
    entitiesOrPaths: methodList,
    filterObjects,
    multiPathSeparator: "::"
  });
}