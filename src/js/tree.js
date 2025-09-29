import { deepClone, filterEntityList, mergeTerminalNodes } from "@mat3ra/code/dist/js/utils";
import lodash from "lodash";
import _ from "underscore";

import modelMethodMap from "./data/model_method_map";

// TODO: migrate to use manifest instead

export const METHODS = {
    pseudopotential: "pseudopotential",
    localorbital: "localorbital",
    unknown: "unknown",
};

const methods = {
    [METHODS.pseudopotential]: ["paw", "nc", "nc-fr", "us"],
    // TODO: Add additional basis set options, once user choice of specific (i.e 3-21G vs cc-pVDZ) is implemented.
    [METHODS.localorbital]: ["pople"],
    [METHODS.unknown]: ["unknown"],
};

export const getPseudopotentialTypesFromTree = () => methods[METHODS.pseudopotential];

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

export const getDFTFunctionalsFromTree = () => Object.keys(DFTModelTree);

export const getDFTFunctionalsByApproximation = (approximation) => {
    const branch = DFTModelTree[approximation];
    return branch && branch.functionals;
};

// GENERAL

export const MODEL_TREE = {
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

export const MODEL_NAMES = {
    dft: "density functional theory",
    lda: "local density approximation",
    gga: "generalized gradient approximation",
    hybrid: "hybrid functional",
    ml: "machine learning",
    re: "regression",
};

export const treeSlugToNamedObject = (modelSlug) => {
    return {
        slug: modelSlug,
        name: lodash.get(MODEL_NAMES, modelSlug, modelSlug),
    };
};

// TODO: find a better way to handle application-specific model-method combination
// must be a subset of the MODEL_TREE above
// demonstrate how tree can be modified
// VASP_MODELS_TREE.gga.functionals = _.omit(VASP_MODELS_TREE.gga.functionals);

const VASP_MODELS_TREE = deepClone(_.pick(MODEL_TREE, "dft"));
const ESPRESSO_MODELS_TREE = deepClone(_.pick(MODEL_TREE, "dft"));
const NWCHEM_MODELS_TREE = deepClone(_.pick(MODEL_TREE, "dft"));

["gga", "lda"].forEach((approximation) => {
    // pick "paw" for vasp
    VASP_MODELS_TREE.dft[approximation].methods.pseudopotential = VASP_MODELS_TREE.dft[
        approximation
    ].methods.pseudopotential.splice(0, 1);

    // assert "us" is the first option
    ESPRESSO_MODELS_TREE.dft[approximation].methods.pseudopotential =
        ESPRESSO_MODELS_TREE.dft[approximation].methods.pseudopotential.reverse();
});

const UNKNOWN_MODELS_TREE = _.pick(MODEL_TREE, "unknown");
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

export const getTreeByApplicationNameAndVersion = ({
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

export const getDefaultModelTypeForApplication = (application) => {
    return Object.keys(getTreeByApplicationNameAndVersion(application))[0];
};

function safelyGet(obj, ...args) {
    return lodash.get(obj, args, undefined);
}

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
function getMethodFilterObjects({ filterTree, tier1, tier2, tier3, type, subtype }) {
    let filterList;
    if (!tier1) {
        filterList = mergeTerminalNodes(filterTree);
    } else if (!tier2) {
        filterList = mergeTerminalNodes(safelyGet(filterTree, tier1));
    } else if (!tier3) {
        filterList = mergeTerminalNodes(safelyGet(filterTree, tier1, tier2));
    } else if (!type) {
        filterList = mergeTerminalNodes(safelyGet(filterTree, tier1, tier2, tier3));
    } else if (!subtype) {
        filterList = mergeTerminalNodes(safelyGet(filterTree, tier1, tier2, tier3, type));
    } else {
        filterList = safelyGet(filterTree, tier1, tier2, tier3, type, subtype);
    }
    const extractUniqueBy = (name) => {
        return lodash
            .chain(filterList)
            .filter(Boolean)
            .filter((o) => Boolean(o[name]))
            .uniqBy(name)
            .value();
    };

    return [].concat(extractUniqueBy("path"), extractUniqueBy("regex"));
}

/**
 * Filter list of method configs based on model
 * @param {Object[]} methodList - Array of method configs
 * @param {Object} model - Model config for which methods should be filtered
 * @return {Object[]}
 */
export function filterMethodsByModel({ methodList, model }) {
    if (!model) return [];
    const { categories } = model;
    const filterObjects = getMethodFilterObjects({ filterTree: modelMethodMap, ...categories });
    return filterEntityList({
        entitiesOrPaths: methodList,
        filterObjects,
        multiPathSeparator: "::",
    });
}
