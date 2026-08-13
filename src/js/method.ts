import { InMemoryEntity } from "@mat3ra/code/dist/js/entity";
import {
    type HashedEntity,
    hashedEntityMixin,
} from "@mat3ra/code/dist/js/entity/mixins/HashedEntityMixin";
import { deepClone } from "@mat3ra/code/dist/js/utils";
import type {
    BaseInMemoryEntitySchema,
    BaseMethod,
    FileDataItem,
    SlugifiedEntry,
} from "@mat3ra/esse/dist/js/types";

import { PseudopotentialMethodConfig } from "./default_methods";
import { type MethodSchemaMixin, methodSchemaMixin } from "./generated/MethodSchemaMixin";

type MethodEntity = BaseMethod & BaseInMemoryEntitySchema;

export interface Method extends MethodSchemaMixin, HashedEntity {}

interface MethodData extends Record<string, unknown> {
    searchText?: string;
    pseudo?: FileDataItem[];
    allPseudo?: FileDataItem[];
}

export class Method extends InMemoryEntity<MethodEntity> implements BaseMethod, HashedEntity {
    constructor(config: BaseMethod) {
        const data = config.data || {};
        super({ ...config, data });
    }

    cloneWithoutData(): Method {
        const clone = this.clone() as Method;
        clone.setData({});
        return clone;
    }

    setSubtype(subtype: SlugifiedEntry): void {
        this.setProp("subtype", subtype);
    }

    static get defaultConfig() {
        return PseudopotentialMethodConfig;
    }

    get methodData(): MethodData {
        return (this.data as MethodData | undefined) ?? {};
    }

    get searchText(): string {
        return this.methodData.searchText ?? "";
    }

    setSearchText(searchText: string): void {
        this.setData({ ...this.methodData, searchText });
    }

    setData(data: MethodData = {}): void {
        this.data = data;
    }

    cleanData(fieldsToExclude: string[] = []): MethodData {
        const filteredData = { ...this.methodData };
        fieldsToExclude.forEach((field) => {
            delete filteredData[field];
        });
        return filteredData;
    }

    toJSONWithCleanData(fieldsToExclude: string[] = []): BaseMethod {
        const json = { ...this._json, data: this.cleanData(fieldsToExclude) };
        return deepClone(json);
    }

    getHashObject(): Record<string, unknown> {
        const json = { ...this.toJSONWithCleanData() } as Record<string, unknown>;
        delete json.data;
        return json;
    }
}

methodSchemaMixin(Method.prototype);
hashedEntityMixin(Method.prototype);
