import { safeMakeArray } from "@mat3ra/code/dist/js/utils";
import _ from "underscore";

import { MethodFactory } from "../methods/factory";
import { Model } from "../model";
import { treeSlugToNamedObject } from "../tree";
import type { ModelConfig, NamedSlug, StringOrNamedSlug } from "../types";

export class DFTModel extends Model {
    constructor(config: ModelConfig & { MethodFactory?: typeof MethodFactory }) {
        super(config);
        this._MethodFactory = config.MethodFactory || MethodFactory;
    }

    get groupSlug(): string {
        const functionalSlug = this.functional.slug;
        const refinersSlug = this.refiners.map((o) => o.slug).join("+");
        const modifiersSlug = this.modifiers.map((o) => o.slug).join("+");
        const slugs = [
            this._application?.shortName,
            this.type,
            this.subtype,
            functionalSlug,
            refinersSlug,
            modifiersSlug,
        ].filter(Boolean);
        return slugs.join(":");
    }

    get defaultFunctional(): NamedSlug {
        const [slug] = this.treeBranchForSubType.functionals || [];
        return treeSlugToNamedObject(slug);
    }

    get defaultRefiners(): NamedSlug[] {
        return [];
    }

    get defaultModifiers(): NamedSlug[] {
        return [];
    }

    get functional(): NamedSlug {
        return this.prop<NamedSlug>("functional", this.defaultFunctional);
    }

    get refiners(): NamedSlug[] {
        return this.prop<NamedSlug[]>("refiners", this.defaultRefiners);
    }

    get modifiers(): NamedSlug[] {
        return this.prop<NamedSlug[]>("modifiers", this.defaultModifiers);
    }

    setSubtype(subtype: StringOrNamedSlug): void {
        this.setProp("subtype", subtype);
        this.setFunctional(this.defaultFunctional);
    }

    setFunctional(functional: StringOrNamedSlug): void {
        this.setProp("functional", this._stringToSlugifiedObject(functional));
        this.setMethod(this._MethodFactory.create(this.defaultMethodConfig));
    }

    private _setArrayProp(
        name: "refiners" | "modifiers",
        data: StringOrNamedSlug | StringOrNamedSlug[],
    ): void {
        const normalized = safeMakeArray(data).map((item) => this._stringToSlugifiedObject(item));
        this.setProp(name, normalized);
        (this as unknown as Record<string, NamedSlug[]>)[`_${name}`] = normalized;
    }

    setRefiners(refiners: StringOrNamedSlug | StringOrNamedSlug[]): void {
        this._setArrayProp("refiners", refiners);
    }

    setModifiers(modifiers: StringOrNamedSlug | StringOrNamedSlug[]): void {
        this._setArrayProp("modifiers", modifiers);
    }

    toJSON(): Record<string, unknown> {
        const pickSlugFromObject = (item: NamedSlug) => _.pick(item, "slug");
        return {
            ...super.toJSON(),
            functional: pickSlugFromObject(this.functional),
            refiners: this.refiners,
            modifiers: this.modifiers,
        };
    }

    get allFunctionals(): NamedSlug[] {
        return (this.treeBranchForSubType.functionals || []).map((slug) => treeSlugToNamedObject(slug));
    }

    get allRefiners(): NamedSlug[] {
        return (this.treeBranchForSubType.refiners || []).map((slug) => treeSlugToNamedObject(slug));
    }

    get allModifiers(): NamedSlug[] {
        return (this.treeBranchForSubType.modifiers || []).map((slug) => treeSlugToNamedObject(slug));
    }
}

