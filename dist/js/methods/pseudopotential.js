"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.PseudopotentialMethod = void 0;
const utils_1 = require("@mat3ra/code/dist/js/utils");
const underscore_1 = __importDefault(require("underscore"));
const method_1 = require("../method");
class PseudopotentialMethod extends method_1.Method {
    constructor(config) {
        super(config);
        this.PseudopotentialCls = null;
    }
    get pseudo() {
        return this.prop("data.pseudo", []);
    }
    get allPseudo() {
        return this.prop("data.allPseudo", []);
    }
    get pseudopotentials() {
        if (!this.PseudopotentialCls) return [];
        return this.pseudo.map((config) => new this.PseudopotentialCls(config));
    }
    get allPseudopotentials() {
        if (!this.PseudopotentialCls) return [];
        return this.allPseudo.map((config) => new this.PseudopotentialCls(config));
    }
    static extractExchangeCorrelationFromSubworkflow(subworkflow) {
        const { model } = subworkflow;
        const approximation = model.subtype;
        const functionalValue = model.functional;
        const functional = functionalValue && (functionalValue.slug || functionalValue);
        return {
            approximation,
            functional: functional || "",
        };
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
        filtered.push(pseudo);
        this.setPseudopotentials(filtered);
    }
    addToAllPseudos(pseudos) {
        const list = (0, utils_1.safeMakeArray)(pseudos);
        const all = this.allPseudopotentials;
        all.push(...list);
        this.setAllPseudopotentials(all);
    }
    setPseudopotentials(pseudopotentials) {
        this.setData({
            ...this.data,
            pseudo: underscore_1.default
                .sortBy(pseudopotentials, "element")
                .map((item) => item.toJSON()),
        });
    }
    setAllPseudopotentials(pseudopotentials) {
        this.setData({
            ...this.data,
            allPseudo: underscore_1.default
                .sortBy(pseudopotentials, "element")
                .map((item) => item.toJSON()),
        });
    }
    toJSONWithCleanData(exclude = []) {
        return super.toJSONWithCleanData(exclude.concat(["allPseudo"]));
    }
}
exports.PseudopotentialMethod = PseudopotentialMethod;
//# sourceMappingURL=pseudopotential.js.map
