import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import { type BaseMethod, type FileDataItem } from "@mat3ra/esse/dist/js/types";
import { PseudopotentialFilter, PseudopotentialMetaProperty } from "@mat3ra/prode";
import _ from "underscore";

import { Method } from "../method";

export type ExchangeCorrelation = {
    approximation: string;
    functional: string;
};

export class PseudopotentialMethod extends Method {
    declare toJSON: () => BaseMethod & AnyObject;

    get pseudo() {
        return this.prop<FileDataItem[]>("data.pseudo", []);
    }

    get allPseudo() {
        return this.prop<FileDataItem[]>("data.allPseudo", []);
    }

    get pseudopotentials() {
        return this.pseudo.map((config) => new PseudopotentialMetaProperty(config));
    }

    get allPseudopotentials() {
        return this.allPseudo.map((config) => new PseudopotentialMetaProperty(config));
    }

    hasPseudopotentialFor(element: string): boolean {
        return Boolean(this.pseudopotentials.find((pseudo) => pseudo.element === element));
    }

    setPseudopotentialPerElement(pseudo?: PseudopotentialMetaProperty) {
        if (!pseudo) {
            this.setPseudopotentials([]);
            return;
        }
        const filtered = this.pseudopotentials.filter((item) => item.element !== pseudo.element);

        this.setPseudopotentials([...filtered, pseudo]);
    }

    addToAllPseudos(pseudos: PseudopotentialMetaProperty | PseudopotentialMetaProperty[]) {
        const list = Array.isArray(pseudos) ? pseudos : [pseudos];
        this.setAllPseudopotentials([...this.allPseudopotentials, ...list]);
    }

    setPseudopotentials(pseudopotentials: PseudopotentialMetaProperty[]) {
        this.setData({
            ...this.data,
            pseudo: _.sortBy(pseudopotentials, "element").map((item) => item.toJSON()),
        });
    }

    setAllPseudopotentials(pseudopotentials: PseudopotentialMetaProperty[]) {
        this.setData({
            ...this.data,
            allPseudo: _.sortBy(pseudopotentials, "element").map((item) => item.toJSON()),
        });
    }

    toJSONWithCleanData(exclude: string[] = []): BaseMethod {
        return super.toJSONWithCleanData(exclude.concat(["allPseudo"]));
    }

    updateMethodDataByApplicationAndMaterials(
        methodDataItems: PseudopotentialMetaProperty[],
        pseudoFilter: Pick<PseudopotentialFilter, "elements" | "appName" | "exchangeCorrelation">,
    ) {
        const typeFilter = { type: this.subtype };
        let pseudos = PseudopotentialMetaProperty.applyPseudoFilters(methodDataItems, {
            ...pseudoFilter,
            ...typeFilter,
        });

        // sorting pseudos, this is very hacky! TODO: find better approach for default pseudos per application
        if (this.subtype === "us") {
            pseudos = PseudopotentialMetaProperty.sortPseudosByPattern(pseudos);
        }
        pseudos = PseudopotentialMetaProperty.sortByPathApplicationSpecific(
            pseudos,
            pseudoFilter.appName,
        );
        pseudos = PseudopotentialMetaProperty.filterUnique(pseudos);

        this.setAllPseudopotentials(pseudos);
        this.setSearchText(this.searchText);

        // if searchText is present => use it to filter the pseudos before selecting one per element
        pseudos = PseudopotentialMetaProperty.safelyFilterRawDataBySearchText(
            pseudos,
            this.searchText,
        );

        const newFilter = {
            elements: pseudoFilter.elements,
            appName: pseudoFilter.appName,
            exchangeCorrelation: pseudoFilter.exchangeCorrelation,
            searchText: this.searchText,
            ...typeFilter,
        };

        // try to keep previously selected pseudos
        // TODO: rework creating/updating method data items once methodData has been removed from store
        const filteredSelected = PseudopotentialMetaProperty.applyPseudoFilters(
            this.pseudopotentials,
            newFilter,
        );

        // set first pseudopotentials as selected per element, prioritize already selected
        pseudoFilter.elements?.forEach((el) => {
            const selected = filteredSelected.find((p) => p.element === el);
            const pseudo = selected || pseudos.find((p) => p.element === el);
            this.setPseudopotentialPerElement(pseudo);
        });

        return this;
    }
}
