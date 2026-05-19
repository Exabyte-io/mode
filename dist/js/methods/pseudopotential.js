"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PseudopotentialMethod = void 0;
const prode_1 = require("@mat3ra/prode");
const underscore_1 = __importDefault(require("underscore"));
const method_1 = require("../method");
class PseudopotentialMethod extends method_1.Method {
    get pseudo() {
        return this.prop("data.pseudo", []);
    }
    get allPseudo() {
        return this.prop("data.allPseudo", []);
    }
    get pseudopotentials() {
        return this.pseudo.map((config) => new prode_1.PseudopotentialMetaProperty(config));
    }
    get allPseudopotentials() {
        return this.allPseudo.map((config) => new prode_1.PseudopotentialMetaProperty(config));
    }
    hasPseudopotentialFor(element) {
        return Boolean(this.pseudopotentials.find((pseudo) => pseudo.element === element));
    }
    setPseudopotentialPerElement(pseudo) {
        if (!pseudo) {
            this.setPseudopotentials([]);
            return;
        }
        const filtered = this.pseudopotentials.filter((item) => item.element !== pseudo.element);
        this.setPseudopotentials([...filtered, pseudo]);
    }
    addToAllPseudos(pseudos) {
        const list = Array.isArray(pseudos) ? pseudos : [pseudos];
        this.setAllPseudopotentials([...this.allPseudopotentials, ...list]);
    }
    setPseudopotentials(pseudopotentials) {
        this.setData({
            ...this.data,
            pseudo: underscore_1.default.sortBy(pseudopotentials, "element").map((item) => item.toJSON()),
        });
    }
    setAllPseudopotentials(pseudopotentials) {
        this.setData({
            ...this.data,
            allPseudo: underscore_1.default.sortBy(pseudopotentials, "element").map((item) => item.toJSON()),
        });
    }
    toJSONWithCleanData(exclude = []) {
        return super.toJSONWithCleanData(exclude.concat(["allPseudo"]));
    }
    updateMethodDataByApplicationAndMaterials(methodDataItems, pseudoFilter) {
        var _a;
        const typeFilter = { type: this.subtype };
        let pseudos = prode_1.PseudopotentialMetaProperty.applyPseudoFilters(methodDataItems, {
            ...pseudoFilter,
            ...typeFilter,
        });
        // sorting pseudos, this is very hacky! TODO: find better approach for default pseudos per application
        if (this.subtype === "us") {
            pseudos = prode_1.PseudopotentialMetaProperty.sortPseudosByPattern(pseudos);
        }
        pseudos = prode_1.PseudopotentialMetaProperty.sortByPathVASP(pseudos);
        pseudos = prode_1.PseudopotentialMetaProperty.filterUnique(pseudos);
        this.setAllPseudopotentials(pseudos);
        this.setSearchText(this.searchText);
        // if searchText is present => use it to filter the pseudos before selecting one per element
        pseudos = prode_1.PseudopotentialMetaProperty.safelyFilterRawDataBySearchText(pseudos, this.searchText);
        const newFilter = {
            elements: pseudoFilter.elements,
            appName: pseudoFilter.appName,
            exchangeCorrelation: pseudoFilter.exchangeCorrelation,
            searchText: this.searchText,
            ...typeFilter,
        };
        // try to keep previously selected pseudos
        // TODO: rework creating/updating method data items once methodData has been removed from store
        const filteredSelected = prode_1.PseudopotentialMetaProperty.applyPseudoFilters(this.pseudopotentials, newFilter);
        // set first pseudopotentials as selected per element, prioritize already selected
        (_a = pseudoFilter.elements) === null || _a === void 0 ? void 0 : _a.forEach((el) => {
            const selected = filteredSelected.find((p) => p.element === el);
            const pseudo = selected || pseudos.find((p) => p.element === el);
            this.setPseudopotentialPerElement(pseudo);
        });
        return this;
    }
}
exports.PseudopotentialMethod = PseudopotentialMethod;
