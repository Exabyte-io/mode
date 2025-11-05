"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
const entity_1 = require("@mat3ra/code/dist/js/entity");
const utils_1 = require("@mat3ra/code/dist/js/utils");
const lodash_1 = __importDefault(require("lodash"));
const default_methods_1 = require("./default_methods");
const MethodSchemaMixin_1 = require("./generated/MethodSchemaMixin");
class Method extends entity_1.InMemoryEntity {
    constructor(config) {
        const data = config.data || {};
        super({ ...config, data });
    }
    cloneWithoutData() {
        const clone = this.clone();
        clone.setData({});
        return clone;
    }
    setSubtype(subtype) {
        this.setProp("subtype", subtype);
    }
    static get defaultConfig() {
        return default_methods_1.PseudopotentialMethodConfig;
    }
    get searchText() {
        return this.prop("data.searchText", "");
    }
    setSearchText(searchText) {
        this.setData({ ...this.data, searchText });
    }
    setData(data = {}) {
        this.setProp("data", data);
    }
    get omitInHashCalculation() {
        const data = this.data;
        return (
            !(data === null || data === void 0 ? void 0 : data.searchText) &&
            lodash_1.default.isEmpty(lodash_1.default.omit(data, "searchText"))
        );
    }
    cleanData(fieldsToExclude = []) {
        const filteredData = { ...this.data };
        fieldsToExclude.forEach((field) => {
            delete filteredData[field];
        });
        return filteredData;
    }
    toJSONWithCleanData(fieldsToExclude = []) {
        const json = { ...this._json, data: this.cleanData(fieldsToExclude) };
        return (0, utils_1.deepClone)(json);
    }
}
exports.Method = Method;
(0, MethodSchemaMixin_1.methodSchemaMixin)(Method.prototype);
