"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.Model = void 0;
var _entity = require("@mat3ra/code/dist/js/entity");
var _lodash = _interopRequireDefault(require("lodash"));
var _default_models = require("./default_models");
var _method = require("./method");
var _factory = require("./methods/factory");
var _tree = require("./tree");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
}
class Model extends _entity.InMemoryEntity {
    constructor({ application, ...config }) {
        super(config);
        this._application = application;
        this._MethodFactory = _factory.MethodFactory;
    }
    get type() {
        return this.prop("type", this.defaultType);
    }
    get subtype() {
        return this.prop("subtype", this.defaultSubtype);
    }
    setSubtype(subtype) {
        this.setProp("subtype", subtype);
        this.setMethod(this._MethodFactory.create(this.defaultMethodConfig));
    }
    get allowedTypes() {
        return Object.keys(this.tree).map((modelSlug) =>
            (0, _tree.treeSlugToNamedObject)(modelSlug),
        );
    }
    get allowedSubtypes() {
        return Object.keys(this.treeBranchForType).map((slug) =>
            (0, _tree.treeSlugToNamedObject)(slug),
        );
    }
    get defaultType() {
        return this.allowedTypes[0]?.slug;
    }
    get defaultSubtype() {
        return this.allowedSubtypes[0]?.slug;
    }
    get tree() {
        return (this._application && this.treeByApplicationNameAndVersion) || _tree.MODEL_TREE;
    }
    get treeBranchForType() {
        return this.tree[this.type] || {};
    }
    get treeBranchForSubType() {
        return this.treeBranchForType[this.subtype] || {};
    }
    get treeByApplicationNameAndVersion() {
        const [name, version] = [this._application.name, this._application.version];
        return (0, _tree.getTreeByApplicationNameAndVersion)({
            name,
            version,
        });
    }
    get groupSlug() {
        return `${this._application.shortName}:${this.type}:${this.subtype}`;
    }
    get method() {
        if (!this._method) {
            const method = this.prop("method") || this.defaultMethodConfig;
            this._method = this._MethodFactory.create(method);
        }
        return this._method;
    }
    setMethod(method) {
        this._method = method;
    }

    // Consider moving the below to `Method`
    get methodsFromTree() {
        return this.treeBranchForSubType.methods || {};
    }
    get methodTypes() {
        return Object.keys(this.methodsFromTree).map((m) => (0, _tree.treeSlugToNamedObject)(m));
    }
    get methodSubtypes() {
        return (
            this.methodsFromTree[this.method.type].map((m) =>
                (0, _tree.treeSlugToNamedObject)(m),
            ) || []
        );
    }
    get defaultMethodConfig() {
        const type = Object.keys(this.methodsFromTree)[0];
        const subtype = (this.methodsFromTree[type] || [])[0];
        return {
            type,
            subtype,
        };
    }
    static get defaultConfig() {
        return {
            ..._default_models.DFTModelConfig,
            method: _method.Method.defaultConfig,
        };
    }
    static get allTypes() {
        return Object.keys(this.tree).map((modelSlug) =>
            (0, _tree.treeSlugToNamedObject)(modelSlug),
        );
    }
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type,
            subtype: this.subtype,
            // TODO: use schema-based cleaning instead
            method: this.method.toJSONWithCleanData(),
        };
    }

    // to be used with extra properties
    // eslint-disable-next-line class-methods-use-this
    _stringToSlugifiedObject(slug) {
        return _lodash.default.isString(slug)
            ? {
                  slug,
              }
            : slug;
    }
    get isUnknown() {
        return this.type === "unknown";
    }
}
exports.Model = Model;
