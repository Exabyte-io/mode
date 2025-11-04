"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.treeSlugToNamedObject =
    exports.getTreeByApplicationNameAndVersion =
    exports.getPseudopotentialTypesFromTree =
    exports.getDefaultModelTypeForApplication =
    exports.getDFTFunctionalsFromTree =
    exports.getDFTFunctionalsByApproximation =
    exports.MODEL_TREE =
    exports.MODEL_NAMES =
    exports.METHODS =
        void 0;
var _utils = require("@mat3ra/code/dist/js/utils");
var _lodash = _interopRequireDefault(require("lodash"));
var _underscore = _interopRequireDefault(require("underscore"));
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
}
// TODO: migrate to use manifest instead

const METHODS = (exports.METHODS = {
    pseudopotential: "pseudopotential",
    localorbital: "localorbital",
    unknown: "unknown",
});
const methods = {
    [METHODS.pseudopotential]: ["paw", "nc", "nc-fr", "us"],
    // TODO: Add additional basis set options, once user choice of specific (i.e 3-21G vs cc-pVDZ) is implemented.
    [METHODS.localorbital]: ["pople"],
    [METHODS.unknown]: ["unknown"],
};
const getPseudopotentialTypesFromTree = () => methods[METHODS.pseudopotential];

// DFT-specific
exports.getPseudopotentialTypesFromTree = getPseudopotentialTypesFromTree;
const DFTModelRefiners = ["hse", "g0w0"];
const DFTModelModifiers = ["soc", "magn"];
const DFTModelTree = {
    gga: {
        refiners: DFTModelRefiners,
        modifiers: DFTModelModifiers,
        methods,
        functionals: ["pbe", "pbesol", "pw91", "other"],
    },
    lda: {
        refiners: DFTModelRefiners,
        modifiers: DFTModelModifiers,
        methods,
        functionals: ["pz", "pw", "vwn", "other"],
    },
    hybrid: {
        methods,
        functionals: ["b3lyp", "hse06"],
    },
    other: {
        methods,
        functionals: ["other"],
    },
};
const getDFTFunctionalsFromTree = () => Object.keys(DFTModelTree);
exports.getDFTFunctionalsFromTree = getDFTFunctionalsFromTree;
const getDFTFunctionalsByApproximation = (approximation) => {
    const branch = DFTModelTree[approximation];
    return branch && branch.functionals;
};

// GENERAL
exports.getDFTFunctionalsByApproximation = getDFTFunctionalsByApproximation;
const MODEL_TREE = (exports.MODEL_TREE = {
    dft: DFTModelTree,
    ml: {
        re: {
            methods: {
                linear: ["least_squares", "ridge"],
                kernel_ridge: ["least_squares"],
            },
        },
    },
    unknown: {
        unknown: {
            methods: {
                unknown: ["unknown"],
            },
        },
    },
});
const MODEL_NAMES = (exports.MODEL_NAMES = {
    dft: "density functional theory",
    lda: "local density approximation",
    gga: "generalized gradient approximation",
    hybrid: "hybrid functional",
    ml: "machine learning",
    re: "regression",
});
const treeSlugToNamedObject = (modelSlug) => {
    return {
        slug: modelSlug,
        name: _lodash.default.get(MODEL_NAMES, modelSlug, modelSlug),
    };
};

// TODO: find a better way to handle application-specific model-method combination
// must be a subset of the MODEL_TREE above
// demonstrate how tree can be modified
// VASP_MODELS_TREE.gga.functionals = _.omit(VASP_MODELS_TREE.gga.functionals);
exports.treeSlugToNamedObject = treeSlugToNamedObject;
const VASP_MODELS_TREE = (0, _utils.deepClone)(_underscore.default.pick(MODEL_TREE, "dft"));
const ESPRESSO_MODELS_TREE = (0, _utils.deepClone)(_underscore.default.pick(MODEL_TREE, "dft"));
const NWCHEM_MODELS_TREE = (0, _utils.deepClone)(_underscore.default.pick(MODEL_TREE, "dft"));
["gga", "lda"].forEach((approximation) => {
    // pick "paw" for vasp
    VASP_MODELS_TREE.dft[approximation].methods.pseudopotential = VASP_MODELS_TREE.dft[
        approximation
    ].methods.pseudopotential.splice(0, 1);

    // assert "us" is the first option
    ESPRESSO_MODELS_TREE.dft[approximation].methods.pseudopotential =
        ESPRESSO_MODELS_TREE.dft[approximation].methods.pseudopotential.reverse();
});
const UNKNOWN_MODELS_TREE = _underscore.default.pick(MODEL_TREE, "unknown");
// const ML_MODELS_TREE = _.pick(MODEL_TREE, "ml");

const MODELS_TREE_CONFIGS_BY_APPLICATION_NAME_VERSION = [
    {
        name: "vasp",
        tree: VASP_MODELS_TREE,
    },
    {
        name: "espresso",
        tree: ESPRESSO_MODELS_TREE,
    },
    {
        name: "python",
        tree: UNKNOWN_MODELS_TREE,
    },
    {
        name: "shell",
        tree: UNKNOWN_MODELS_TREE,
    },
    {
        name: "jupyterLab",
        tree: UNKNOWN_MODELS_TREE,
    },
    {
        name: "nwchem",
        tree: NWCHEM_MODELS_TREE,
    },
    {
        name: "deepmd",
        tree: UNKNOWN_MODELS_TREE,
    },
];
const getTreeByApplicationNameAndVersion = ({
    name,
    // eslint-disable-next-line no-unused-vars
    version,
}) => {
    // TODO: add logic to filter by version when necessary
    const cfgs = MODELS_TREE_CONFIGS_BY_APPLICATION_NAME_VERSION.filter(
        (cfg) => cfg.name === name,
    ).map((x) => x.tree);
    return Object.assign({}, ...cfgs);
};
exports.getTreeByApplicationNameAndVersion = getTreeByApplicationNameAndVersion;
const getDefaultModelTypeForApplication = (application) => {
    return Object.keys(getTreeByApplicationNameAndVersion(application))[0];
};
exports.getDefaultModelTypeForApplication = getDefaultModelTypeForApplication;
