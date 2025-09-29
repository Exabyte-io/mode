import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { deepClone } from "@mat3ra/code/dist/js/utils";
import lodash from "lodash";

import { PseudopotentialMethodConfig } from "./default_methods";

export class Method extends InMemoryEntity {
    constructor(config) {
        const data = config.data || {};
        super({ ...config, data });
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
        return PseudopotentialMethodConfig;
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
        this.setData({ ...this.prop("data"), searchText });
    }

    setData(data = {}) {
        this.setProp("data", data);
    }

    get omitInHashCalculation() {
        const data = this.prop("data");
        return !data.searchText && lodash.isEmpty(lodash.omit(data, "searchText"));
    }

    // data without client-only fields
    cleanData(fieldsToExclude = []) {
        const filteredData = { ...this.prop("data") };
        fieldsToExclude.forEach((f) => {
            delete filteredData[f];
        });
        return filteredData;
    }

    // override in child class if needed
    toJSONWithCleanData(fieldsToExclude = []) {
        const json = { ...this._json, data: this.cleanData(fieldsToExclude) };
        return deepClone(json);
    }
}
