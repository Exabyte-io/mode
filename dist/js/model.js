"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const entity_1 = require("@mat3ra/code/dist/js/entity");
const lodash_1 = __importDefault(require("lodash"));
const default_models_1 = require("./default_models");
const ModelSchemaMixin_1 = require("./generated/ModelSchemaMixin");
const method_1 = require("./method");
const factory_1 = require("./methods/factory");
const tree_1 = require("./tree");
const EMPTY_BRANCH = { methods: {} };
class Model extends entity_1.InMemoryEntity {
    constructor(config) {
        const { application, ...entityConfig } = config;
        super(entityConfig);
        this._application = application;
        this._MethodFactory = factory_1.MethodFactory;
    }
    setSubtype(subtype) {
        this.setProp("subtype", subtype);
        this.setMethod(this._MethodFactory.create(this.defaultMethodConfig));
    }
    get allowedTypes() {
        return Object.keys(this.tree).map((modelSlug) => (0, tree_1.treeSlugToNamedObject)(modelSlug));
    }
    get allowedSubtypes() {
        return Object.keys(this.treeBranchForType).map((slug) => (0, tree_1.treeSlugToNamedObject)(slug));
    }
    get defaultType() {
        var _a;
        return ((_a = this.allowedTypes[0]) === null || _a === void 0 ? void 0 : _a.slug) || "";
    }
    get defaultSubtype() {
        var _a;
        return ((_a = this.allowedSubtypes[0]) === null || _a === void 0 ? void 0 : _a.slug) || "";
    }
    get tree() {
        if (this._application) {
            const treeByApplication = this.treeByApplicationNameAndVersion;
            if (treeByApplication)
                return treeByApplication;
        }
        return tree_1.MODEL_TREE;
    }
    get treeBranchForType() {
        return this.tree[this.type] || {};
    }
    get treeBranchForSubType() {
        return this.treeBranchForType[this.subtypeSlug] || EMPTY_BRANCH;
    }
    get treeByApplicationNameAndVersion() {
        if (!this._application)
            return undefined;
        const { name, version } = this._application;
        return (0, tree_1.getTreeByApplicationNameAndVersion)({ name, version });
    }
    get groupSlug() {
        const subtype = this.subtypeSlug;
        if (!this._application)
            return `${this.type}:${subtype}`;
        return `${this._application.shortName}:${this.type}:${subtype}`;
    }
    get Method() {
        if (!this._method) {
            this._method = this._MethodFactory.create(this.defaultMethodConfig);
        }
        return this._method;
    }
    setMethod(method) {
        this._method = method;
    }
    get methodsFromTree() {
        return this.treeBranchForSubType.methods || {};
    }
    get methodTypes() {
        return Object.keys(this.methodsFromTree).map((type) => (0, tree_1.treeSlugToNamedObject)(type));
    }
    get methodSubtypes() {
        const { type } = this.method;
        const subtypes = this.methodsFromTree[type] || [];
        return subtypes.map((slug) => (0, tree_1.treeSlugToNamedObject)(slug));
    }
    get defaultMethodConfig() {
        var _a;
        const methodTypes = Object.keys(this.methodsFromTree);
        const type = methodTypes[0];
        if (!type)
            return method_1.Method.defaultConfig;
        const subtype = (_a = this.methodsFromTree[type]) === null || _a === void 0 ? void 0 : _a[0];
        if (!subtype)
            return method_1.Method.defaultConfig;
        return { type, subtype };
    }
    static get defaultConfig() {
        return {
            ...default_models_1.DFTModelConfig,
            method: method_1.Method.defaultConfig,
        };
    }
    static get allTypes() {
        return Object.keys(tree_1.MODEL_TREE).map((modelSlug) => (0, tree_1.treeSlugToNamedObject)(modelSlug));
    }
    toJSON() {
        const json = super.toJSON();
        return {
            ...json,
            type: this.type,
            subtype: this.subtype,
            method: this.method.toJSONWithCleanData(),
        };
    }
    _stringToSlugifiedObject(slug) {
        if (lodash_1.default.isString(slug)) {
            return { slug };
        }
        return slug;
    }
    get isUnknown() {
        return this.type === "unknown";
    }
    get subtypeSlug() {
        const subtype = this.subtype;
        return typeof subtype === "string" ? subtype : subtype.slug;
    }
}
exports.Model = Model;
(0, ModelSchemaMixin_1.modelSchemaMixin)(Model.prototype);
