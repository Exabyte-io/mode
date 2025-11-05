"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DFTModel = void 0;
const utils_1 = require("@mat3ra/code/dist/js/utils");
const underscore_1 = __importDefault(require("underscore"));
const factory_1 = require("../methods/factory");
const model_1 = require("../model");
const tree_1 = require("../tree");
class DFTModel extends model_1.Model {
    constructor(config) {
        super(config);
        this._MethodFactory = config.MethodFactory || factory_1.MethodFactory;
    }
    get groupSlug() {
        var _a;
        const functionalSlug = this.functional.slug;
        const refinersSlug = this.refiners.map((o) => o.slug).join("+");
        const modifiersSlug = this.modifiers.map((o) => o.slug).join("+");
        const slugs = [
            (_a = this._application) === null || _a === void 0 ? void 0 : _a.shortName,
            this.type,
            this.subtype,
            functionalSlug,
            refinersSlug,
            modifiersSlug,
        ].filter(Boolean);
        return slugs.join(":");
    }
    get defaultFunctional() {
        const [slug] = this.treeBranchForSubType.functionals || [];
        return (0, tree_1.treeSlugToNamedObject)(slug);
    }
    get defaultRefiners() {
        return [];
    }
    get defaultModifiers() {
        return [];
    }
    get functional() {
        return this.prop("functional", this.defaultFunctional);
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
        const pickSlugFromObject = (item) => underscore_1.default.pick(item, "slug");
        return {
            ...super.toJSON(),
            functional: pickSlugFromObject(this.functional),
            refiners: this.refiners,
            modifiers: this.modifiers,
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
