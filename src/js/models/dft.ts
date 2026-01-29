import { safeMakeArray } from "@mat3ra/code/dist/js/utils";
import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import {
    type DFTModelSchema,
    SlugifiedEntry,
    SlugifiedEntryOrSlug,
} from "@mat3ra/esse/dist/js/types";

import { MethodFactory } from "../methods/factory";
import { Model } from "../model";
import { treeSlugToNamedObject } from "../tree";
import type { ModelConfig } from "../types";

export class DFTModel extends Model {
    constructor(config: ModelConfig & { MethodFactory?: typeof MethodFactory }) {
        super(config);
        this._MethodFactory = config.MethodFactory || MethodFactory;
    }

    declare type: DFTModelSchema["type"];

    declare subtype: DFTModelSchema["subtype"];

    get groupSlug(): string {
        const refinersSlug = this.refiners.map((o) => o.slug).join("+");
        const modifiersSlug = this.modifiers.map((o) => o.slug).join("+");
        const slugs = [
            this._application?.shortName,
            this.type,
            this.subtype,
            this.functional,
            refinersSlug,
            modifiersSlug,
        ].filter(Boolean);
        return slugs.join(":");
    }

    get defaultFunctional(): SlugifiedEntry {
        const [slug] = this.treeBranchForSubType.functionals || [];
        return treeSlugToNamedObject(slug);
    }

    readonly defaultRefiners: SlugifiedEntry[] = [];

    readonly defaultModifiers: SlugifiedEntry[] = [];

    get slugifiedFunctional() {
        return this._stringToSlugifiedObject(this.functional);
    }

    get functional() {
        return this.requiredProp<DFTModelSchema["functional"]>("functional");
    }

    get refiners() {
        return this.prop<SlugifiedEntry[]>("refiners", this.defaultRefiners);
    }

    get modifiers() {
        return this.prop<SlugifiedEntry[]>("modifiers", this.defaultModifiers);
    }

    setSubtype(subtype: SlugifiedEntryOrSlug): void {
        this.setProp("subtype", subtype);
        this.setFunctional(this.defaultFunctional);
    }

    setFunctional(functional: SlugifiedEntryOrSlug): void {
        this.setProp("functional", this._stringToSlugifiedObject(functional));
        this.setMethod(this._MethodFactory.create(this.defaultMethodConfig));
    }

    private _setArrayProp(
        name: "refiners" | "modifiers",
        data: SlugifiedEntryOrSlug | SlugifiedEntryOrSlug[],
    ): void {
        const normalized = safeMakeArray(data).map((item) => this._stringToSlugifiedObject(item));
        this.setProp(name, normalized);
        (this as unknown as Record<string, SlugifiedEntry[]>)[`_${name}`] = normalized;
    }

    setRefiners(refiners: SlugifiedEntryOrSlug | SlugifiedEntryOrSlug[]): void {
        this._setArrayProp("refiners", refiners);
    }

    setModifiers(modifiers: SlugifiedEntryOrSlug | SlugifiedEntryOrSlug[]): void {
        this._setArrayProp("modifiers", modifiers);
    }

    toJSON(): DFTModelSchema & AnyObject {
        const baseJson = super.toJSON();
        const keysToExclude = ["type", "subtype", "functional", "refiners", "modifiers", "method"];
        const restJson = Object.fromEntries(
            Object.entries(baseJson).filter(([key]) => !keysToExclude.includes(key)),
        );

        return {
            type: this.type,
            subtype: this.subtype,
            method: this.Method.toJSONWithCleanData(),
            functional: this.functional,
            refiners: this.refiners,
            modifiers: this.modifiers,
            ...restJson,
        } as DFTModelSchema;
    }

    get allFunctionals(): SlugifiedEntry[] {
        return (this.treeBranchForSubType.functionals || []).map((slug) =>
            treeSlugToNamedObject(slug),
        );
    }

    get allRefiners(): SlugifiedEntry[] {
        return (this.treeBranchForSubType.refiners || []).map((slug) =>
            treeSlugToNamedObject(slug),
        );
    }

    get allModifiers(): SlugifiedEntry[] {
        return (this.treeBranchForSubType.modifiers || []).map((slug) =>
            treeSlugToNamedObject(slug),
        );
    }
}
