"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultModelTypeForApplication = exports.getTreeByApplicationNameAndVersion = exports.treeSlugToNamedObject = exports.MODEL_NAMES = exports.MODEL_TREE = void 0;
const modelsTreeConfigByApplication_json_1 = __importDefault(require("@mat3ra/standata/dist/js/runtime_data/models/modelsTreeConfigByApplication.json"));
const modelTree_json_1 = __importDefault(require("@mat3ra/standata/dist/js/runtime_data/models/modelTree.json"));
const lodash_1 = __importDefault(require("lodash"));
exports.MODEL_TREE = modelTree_json_1.default.MODEL_TREE, exports.MODEL_NAMES = modelTree_json_1.default.MODEL_NAMES;
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
