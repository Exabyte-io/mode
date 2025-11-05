"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultModelTypeForApplication = exports.getTreeByApplicationNameAndVersion = exports.treeSlugToNamedObject = exports.MODEL_NAMES = exports.MODEL_TREE = exports.getDFTFunctionalsByApproximation = exports.getDFTFunctionalsFromTree = exports.getPseudopotentialTypesFromTree = exports.METHODS = void 0;
const utils_1 = require("@mat3ra/code/dist/js/utils");
const lodash_1 = __importDefault(require("lodash"));
const underscore_1 = __importDefault(require("underscore"));
// TODO: migrate to use manifest instead
exports.METHODS = {
    pseudopotential: "pseudopotential",
    localorbital: "localorbital",
    unknown: "unknown",
};
const methods = {
    [exports.METHODS.pseudopotential]: ["paw", "nc", "nc-fr", "us"],
    // TODO: Add additional basis set options, once user choice of specific (i.e 3-21G vs cc-pVDZ) is implemented.
    [exports.METHODS.localorbital]: ["pople"],
    [exports.METHODS.unknown]: ["unknown"],
};
const getPseudopotentialTypesFromTree = () => methods[exports.METHODS.pseudopotential];
exports.getPseudopotentialTypesFromTree = getPseudopotentialTypesFromTree;
// DFT-specific
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
exports.getDFTFunctionalsByApproximation = getDFTFunctionalsByApproximation;
// GENERAL
exports.MODEL_TREE = {
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
};
exports.MODEL_NAMES = {
    dft: "density functional theory",
    lda: "local density approximation",
    gga: "generalized gradient approximation",
    hybrid: "hybrid functional",
    ml: "machine learning",
    re: "regression",
};
const treeSlugToNamedObject = (modelSlug) => {
    return {
        slug: modelSlug,
        name: lodash_1.default.get(exports.MODEL_NAMES, modelSlug, modelSlug),
    };
};
exports.treeSlugToNamedObject = treeSlugToNamedObject;
const VASP_MODELS_TREE = (0, utils_1.deepClone)(underscore_1.default.pick(exports.MODEL_TREE, "dft"));
const ESPRESSO_MODELS_TREE = (0, utils_1.deepClone)(underscore_1.default.pick(exports.MODEL_TREE, "dft"));
const NWCHEM_MODELS_TREE = (0, utils_1.deepClone)(underscore_1.default.pick(exports.MODEL_TREE, "dft"));
["gga", "lda"].forEach((approximation) => {
    // pick "paw" for vasp
    VASP_MODELS_TREE.dft[approximation].methods.pseudopotential = VASP_MODELS_TREE.dft[approximation].methods.pseudopotential.splice(0, 1);
    // assert "us" is the first option
    ESPRESSO_MODELS_TREE.dft[approximation].methods.pseudopotential =
        ESPRESSO_MODELS_TREE.dft[approximation].methods.pseudopotential.reverse();
});
const UNKNOWN_MODELS_TREE = underscore_1.default.pick(exports.MODEL_TREE, "unknown");
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
const getTreeByApplicationNameAndVersion = ({ name, }) => {
    // TODO: add logic to filter by version when necessary
    const cfgs = MODELS_TREE_CONFIGS_BY_APPLICATION_NAME_VERSION.filter((cfg) => cfg.name === name).map((cfg) => cfg.tree);
    return Object.assign({}, ...cfgs);
};
exports.getTreeByApplicationNameAndVersion = getTreeByApplicationNameAndVersion;
const getDefaultModelTypeForApplication = (application) => {
    return Object.keys((0, exports.getTreeByApplicationNameAndVersion)(application))[0];
};
exports.getDefaultModelTypeForApplication = getDefaultModelTypeForApplication;
