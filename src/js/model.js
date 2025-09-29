import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import lodash from "lodash";

import { DFTModelConfig } from "./default_models";
import { Method } from "./method";
import { MethodFactory } from "./methods/factory";
import { getTreeByApplicationNameAndVersion, MODEL_TREE, treeSlugToNamedObject } from "./tree";

export class Model extends InMemoryEntity {
    constructor({ application, ...config }) {
        super(config);
        this._application = application;
        this._MethodFactory = MethodFactory;
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
        return Object.keys(this.tree).map((modelSlug) => treeSlugToNamedObject(modelSlug));
    }

    get allowedSubtypes() {
        return Object.keys(this.treeBranchForType).map((slug) => treeSlugToNamedObject(slug));
    }

    get defaultType() {
        return this.allowedTypes[0]?.slug;
    }

    get defaultSubtype() {
        return this.allowedSubtypes[0]?.slug;
    }

    get tree() {
        return (this._application && this.treeByApplicationNameAndVersion) || MODEL_TREE;
    }

    get treeBranchForType() {
        return this.tree[this.type] || {};
    }

    get treeBranchForSubType() {
        return this.treeBranchForType[this.subtype] || {};
    }

    get treeByApplicationNameAndVersion() {
        const [name, version] = [this._application.name, this._application.version];
        return getTreeByApplicationNameAndVersion({ name, version });
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
        return Object.keys(this.methodsFromTree).map((m) => treeSlugToNamedObject(m));
    }

    get methodSubtypes() {
        return this.methodsFromTree[this.method.type].map((m) => treeSlugToNamedObject(m)) || [];
    }

    get defaultMethodConfig() {
        const type = Object.keys(this.methodsFromTree)[0];
        const subtype = (this.methodsFromTree[type] || [])[0];
        return { type, subtype };
    }

    static get defaultConfig() {
        return {
            ...DFTModelConfig,
            method: Method.defaultConfig,
        };
    }

    static get allTypes() {
        return Object.keys(this.tree).map((modelSlug) => treeSlugToNamedObject(modelSlug));
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
        return lodash.isString(slug) ? { slug } : slug;
    }

    get isUnknown() {
        return this.type === "unknown";
    }
}
