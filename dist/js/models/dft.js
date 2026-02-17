"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DFTModel = void 0;
const utils_1 = require("@mat3ra/code/dist/js/utils");
const factory_1 = require("../methods/factory");
const model_1 = require("../model");
const tree_1 = require("../tree");
class DFTModel extends model_1.Model {
    constructor(config) {
        super(config);
        this.defaultRefiners = [];
        this.defaultModifiers = [];
        this._MethodFactory = config.MethodFactory || factory_1.MethodFactory;
        this.functional =
            this.prop("functional") || this.defaultFunctional.slug;
    }
    get groupSlug() {
        var _a;
        const refinersSlug = this.refiners.map((o) => o.slug).join("+");
        const modifiersSlug = this.modifiers.map((o) => o.slug).join("+");
        const slugs = [
            (_a = this._application) === null || _a === void 0 ? void 0 : _a.shortName,
            this.type,
            this.subtype,
            this.functional,
            refinersSlug,
            modifiersSlug,
        ].filter(Boolean);
        return slugs.join(":");
    }
    get defaultFunctional() {
        const [slug] = this.treeBranchForSubType.functionals || [];
        return (0, tree_1.treeSlugToNamedObject)(slug);
    }
    get slugifiedFunctional() {
        return this._stringToSlugifiedObject(this.functional);
    }
    get functional() {
        return this.requiredProp("functional");
    }
    set functional(functional) {
        this.setProp("functional", functional);
    }
    get refiners() {
        return this.prop("refiners", this.defaultRefiners);
    }
    get modifiers() {
        return this.prop("modifiers", this.defaultModifiers);
    }
    setSubtype(subtype) {
        this.setProp("subtype", subtype);
        this.setFunctional(this.defaultFunctional);
    }
    setFunctional(functional) {
        this.setProp("functional", this._stringToSlugifiedObject(functional));
        this.setMethod(this._MethodFactory.create(this.defaultMethodConfig));
    }
    _setArrayProp(name, data) {
        const normalized = (0, utils_1.safeMakeArray)(data).map((item) => this._stringToSlugifiedObject(item));
        this.setProp(name, normalized);
        this[`_${name}`] = normalized;
    }
    setRefiners(refiners) {
        this._setArrayProp("refiners", refiners);
    }
    setModifiers(modifiers) {
        this._setArrayProp("modifiers", modifiers);
    }
    toJSON() {
        const baseJson = super.toJSON();
        const keysToExclude = ["type", "subtype", "functional", "refiners", "modifiers", "method"];
        const restJson = Object.fromEntries(Object.entries(baseJson).filter(([key]) => !keysToExclude.includes(key)));
        return {
            type: this.type,
            subtype: this.subtype,
            method: this.Method.toJSONWithCleanData(),
            functional: this.functional,
            refiners: this.refiners,
            modifiers: this.modifiers,
            ...restJson,
        };
    }
    get allFunctionals() {
        return (this.treeBranchForSubType.functionals || []).map((slug) => (0, tree_1.treeSlugToNamedObject)(slug));
    }
    get allRefiners() {
        return (this.treeBranchForSubType.refiners || []).map((slug) => (0, tree_1.treeSlugToNamedObject)(slug));
    }
    get allModifiers() {
        return (this.treeBranchForSubType.modifiers || []).map((slug) => (0, tree_1.treeSlugToNamedObject)(slug));
    }
}
exports.DFTModel = DFTModel;
