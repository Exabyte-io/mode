"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultModelTypeForApplication = exports.getTreeByApplicationNameAndVersion = exports.treeSlugToNamedObject = exports.getDFTFunctionalsByApproximation = exports.getDFTFunctionalsFromTree = exports.getPseudopotentialTypesFromTree = exports.METHODS = exports.MODEL_NAMES = exports.MODEL_TREE = void 0;
const modelsTreeConfigByApplication_json_1 = __importDefault(require("@mat3ra/standata/dist/js/runtime_data/models/modelsTreeConfigByApplication.json"));
const modelTree_json_1 = __importDefault(require("@mat3ra/standata/dist/js/runtime_data/models/modelTree.json"));
const lodash_1 = __importDefault(require("lodash"));
exports.MODEL_TREE = modelTree_json_1.default.MODEL_TREE, exports.MODEL_NAMES = modelTree_json_1.default.MODEL_NAMES;
exports.METHODS = {
    pseudopotential: "pseudopotential",
    localorbital: "localorbital",
    unknown: "unknown",
};
const getPseudopotentialTypesFromTree = () => {
    var _a;
    const dftTree = exports.MODEL_TREE.dft;
    const firstBranch = Object.values(dftTree)[0];
    return ((_a = firstBranch === null || firstBranch === void 0 ? void 0 : firstBranch.methods) === null || _a === void 0 ? void 0 : _a.pseudopotential) || [];
};
exports.getPseudopotentialTypesFromTree = getPseudopotentialTypesFromTree;
const getDFTFunctionalsFromTree = () => {
    return Object.keys(exports.MODEL_TREE.dft);
};
exports.getDFTFunctionalsFromTree = getDFTFunctionalsFromTree;
const getDFTFunctionalsByApproximation = (approximation) => {
    const dftTree = exports.MODEL_TREE.dft;
    const branch = dftTree[approximation];
    return branch === null || branch === void 0 ? void 0 : branch.functionals;
};
exports.getDFTFunctionalsByApproximation = getDFTFunctionalsByApproximation;
const treeSlugToNamedObject = (modelSlug) => {
    return {
        slug: modelSlug,
        name: lodash_1.default.get(exports.MODEL_NAMES, modelSlug, modelSlug),
    };
};
exports.treeSlugToNamedObject = treeSlugToNamedObject;
const getTreeByApplicationNameAndVersion = ({ name, }) => {
    // TODO: add logic to filter by version when necessary
    // @ts-ignore
    return modelsTreeConfigByApplication_json_1.default[name] || {};
};
exports.getTreeByApplicationNameAndVersion = getTreeByApplicationNameAndVersion;
const getDefaultModelTypeForApplication = (application) => {
    return Object.keys((0, exports.getTreeByApplicationNameAndVersion)(application))[0];
};
exports.getDefaultModelTypeForApplication = getDefaultModelTypeForApplication;
