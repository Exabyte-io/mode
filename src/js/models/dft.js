import _ from "underscore";

import { MethodFactory } from "../methods/factory";
import { Model } from "../model";
import { treeSlugToNamedObject } from "../tree";

export class DFTModel extends Model {
    constructor(config) {
        super(config);
        this._MethodFactory = config.MethodFactory || MethodFactory;
    }

    /**
     * @summary Build slug string based on model information
     * @returns {string}
     */
    get groupSlug() {
        return [
            this._application.shortName,
            this.type,
            this.subtype,
            this.functional.slug,
            this.refiners.map((o) => o.slug).join("+"),
            this.modifiers.map((o) => o.slug).join("+"),
        ]
            .join(":")
            .replace("::", ":")
            .replace(/:$/, "");
    }

    get defaultFunctional() {
        return treeSlugToNamedObject(this.treeBranchForSubType.functionals[0]);
    }

    // eslint-disable-next-line class-methods-use-this
    get defaultRefiners() {
        return [];
    }

    // eslint-disable-next-line class-methods-use-this
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
        // eslint-disable-next-line no-param-reassign, no-undef
        data = safeMakeArray(data).map((r) => this._stringToSlugifiedObject(r));
        this.setProp(name, data);
        this[`_${name}`] = data;
    }

    setRefiners(refiners) {
        this._setArrayProp("refiners", refiners);
    }

    setModifiers(modifiers) {
        this._setArrayProp("modifiers", modifiers);
    }

    toJSON() {
        const pickSlugFromObject = (o) => _.pick(o, "slug");
        return {
            ...super.toJSON(),
            functional: pickSlugFromObject(this.functional), // only store slug for `functional`
            refiners: this.refiners,
            modifiers: this.modifiers,
        };
    }

    /**
     * Get all functionals in the form of {name: ..., slug: ...} for further use in UI
     * @returns {Object.<string, string>[]} - List of functional objects
     */
    get allFunctionals() {
        return this.treeBranchForSubType.functionals.map((x) => treeSlugToNamedObject(x));
    }

    /**
     * Get all refiners in the form of {name: ..., slug: ...} for further use in UI
     * @returns {Object.<string, string>[]} - List of refiner objects
     */
    get allRefiners() {
        return this.treeBranchForSubType.refiners.map((x) => treeSlugToNamedObject(x));
    }

    /**
     * Get all modifiers in the form of {name: ..., slug: ...} for further use in UI
     * @returns {Object.<string, string>[]} - List of modifier objects
     */
    get allModifiers() {
        return this.treeBranchForSubType.modifiers.map((x) => treeSlugToNamedObject(x));
    }
}
