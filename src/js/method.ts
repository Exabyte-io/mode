import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import { deepClone } from "@mat3ra/code/dist/js/utils";
import { BaseMethod } from "@mat3ra/esse/dist/js/types";
import lodash from "lodash";

import { PseudopotentialMethodConfig } from "./default_methods";

export class Method extends InMemoryEntity<MethodConfigWithData> {
    constructor(config: BaseMethod) {
        const data = config.data || {};
        super({ ...config, data });
    }

    cloneWithoutData(): Method {
        const clone = this.clone() as Method;
        clone.setData({});
        return clone;
    }

    get type(): string {
        return this.prop<string>("type");
    }

    get subtype(): StringOrNamedSlug {
        return this.prop<StringOrNamedSlug>("subtype");
    }

    setSubtype(subtype: StringOrNamedSlug): void {
        this.setProp("subtype", subtype);
    }

    static get defaultConfig(): MethodConfig {
        return PseudopotentialMethodConfig;
    }

    get precision(): number | undefined {
        return this.prop<number | undefined>("precision");
    }

    get data(): MethodData {
        return this.prop<MethodData>("data", {});
    }

    get searchText(): string {
        return this.prop<string>("data.searchText", "");
    }

    setSearchText(searchText: string): void {
        this.setData({ ...this.data, searchText });
    }

    setData(data: MethodData = {}): void {
        this.setProp("data", data);
    }

    get omitInHashCalculation(): boolean {
        const { data } = this;
        return !data.searchText && lodash.isEmpty(lodash.omit(data, "searchText"));
    }

    cleanData(fieldsToExclude: string[] = []): MethodData {
        const filteredData = { ...this.data };
        fieldsToExclude.forEach((field) => {
            delete filteredData[field];
        });
        return filteredData;
    }

    toJSONWithCleanData(fieldsToExclude: string[] = []): MethodConfig {
        const json = { ...this._json, data: this.cleanData(fieldsToExclude) };
        return deepClone(json);
    }
}
