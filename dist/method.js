"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.Method = void 0;
var _entity = require("@mat3ra/code/dist/js/entity");
var _utils = require("@mat3ra/code/dist/js/utils");
var _lodash = _interopRequireDefault(require("lodash"));
var _default_methods = require("./default_methods");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : { default: e };
}
class Method extends _entity.InMemoryEntity {
    constructor(config) {
        const data = config.data || {};
        super({
            ...config,
            data,
        });
    }
    cloneWithoutData() {
        const clone = this.clone();
        clone.setData({});
        return clone;
    }
    get type() {
        return this.prop("type");
    }
    get subtype() {
        return this.prop("subtype");
    }
    setSubtype(subtype) {
        // TODO: add proper handling of method data subscriptions on type/subtype change
        this.setProp("subtype", subtype);
    }
    static get defaultConfig() {
        return _default_methods.PseudopotentialMethodConfig;
    }
    get precision() {
        return this.prop("precision");
    }
    get data() {
        return this.prop("data");
    }
    get searchText() {
        return this.prop("data.searchText", "");
    }

    // used to narrow down the list of methodData items available for selection
    // utilizing "data" field as a "blackbox" container for searchText
    setSearchText(searchText) {
        this.setData({
            ...this.prop("data"),
            searchText,
        });
    }
    setData(data = {}) {
        this.setProp("data", data);
    }
    get omitInHashCalculation() {
        const data = this.prop("data");
        return (
            !data.searchText && _lodash.default.isEmpty(_lodash.default.omit(data, "searchText"))
        );
    }

    // data without client-only fields
    cleanData(fieldsToExclude = []) {
        const filteredData = {
            ...this.prop("data"),
        };
        fieldsToExclude.forEach((f) => {
            delete filteredData[f];
        });
        return filteredData;
    }

    // override in child class if needed
    toJSONWithCleanData(fieldsToExclude = []) {
        const json = {
            ...this._json,
            data: this.cleanData(fieldsToExclude),
        };
        return (0, _utils.deepClone)(json);
    }
}
exports.Method = Method;
