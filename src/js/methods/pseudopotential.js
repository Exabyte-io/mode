import { safeMakeArray } from "@mat3ra/code/dist/js/utils";
import _ from "underscore";

import { Method } from "../method";

export class PseudopotentialMethod extends Method {
    constructor(config) {
        super(config);
        this.PseudopotentialCls = null;
    }

    // "Unique" or "selected" pseudopotentials - one per element
    get pseudo() {
        return this.prop("data.pseudo", []);
    }

    // "All" or "non-unique" pseudopotentials available for a choice
    get allPseudo() {
        return this.prop("data.allPseudo", []);
    }

    get pseudopotentials() {
        return this.pseudo.map((x) => new this.PseudopotentialCls(x));
    }

    get allPseudopotentials() {
        return this.allPseudo.map((x) => new this.PseudopotentialCls(x));
    }

    static extractExchangeCorrelationFromSubworkflow(subworkflow) {
        const { model } = subworkflow;
        const approximation = model.subtype;
        const functional = model.functional ? model.functional.slug || model.functional : "";
        return {
            approximation,
            functional,
        };
    }

    hasPseudopotentialFor(element) {
        return Boolean(this.pseudopotentials.find((x) => x.element === element));
    }

    /**
     * @summary Sets one pseudopotential per element. Subsequent applications will override previous.
     * @param pseudo {Pseudopotential}
     */
    setPseudopotentialPerElement(pseudo) {
        if (!pseudo) {
            this.setPseudopotentials([]);
            return;
        }
        const arr = this.pseudopotentials.filter((x) => x.element !== pseudo.element);
        arr.push(pseudo);
        this.setPseudopotentials(arr);
    }

    // add new pseudopotentials to the list of all pseudopotentials
    addToAllPseudos(pseudos) {
        // eslint-disable-next-line no-param-reassign
        pseudos = safeMakeArray(pseudos);
        const allPseudos = this.allPseudopotentials;
        allPseudos.push(...pseudos);
        this.setAllPseudopotentials(allPseudos);
    }

    /**
     * @param pseudopotentials {Pseudopotential[]}
     */
    setPseudopotentials(pseudopotentials) {
        // sort by alphabetical order to ensure elements order consistency in VASP POSCAR/POTCAR
        this.setData({
            ...this.data,
            pseudo: _.sortBy(pseudopotentials, "element").map((x) => x.toJSON()),
        });
    }

    /**
     * @param pseudopotentials {Pseudopotential[]}
     */
    setAllPseudopotentials(pseudopotentials) {
        // sort by alphabetical order to ensure elements order consistency in VASP POSCAR/POTCAR
        this.setData({
            ...this.data,
            allPseudo: _.sortBy(pseudopotentials, "element").map((x) => x.toJSON()),
        });
    }

    // override default `toJSONWithCleanData` method to avoid saving `allPseudo` inside the workflow
    // TODO: revise after implementing Pseudopotential Sets
    toJSONWithCleanData(exclude = []) {
        return super.toJSONWithCleanData(
            exclude.concat([
                "allPseudo",
                // 'pseudo' - not cleaning the field to save it in `Job.workflow`
            ]),
        );
    }
}
