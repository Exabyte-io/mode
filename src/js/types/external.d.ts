declare module "@mat3ra/code/dist/js/entity" {
    export interface EntityConfig {
        data?: Record<string, unknown>;
        [key: string]: unknown;
    }

    export class InMemoryEntity<TConfig extends EntityConfig = EntityConfig> {
        protected _json: TConfig;

        constructor(config: TConfig);

        clone(): this;

        prop<TValue = unknown>(path: string, defaultValue?: TValue): TValue;

        setProp(path: string, value: unknown): void;

        setData?(data: Record<string, unknown>): void;

        toJSON(): TConfig;
    }
}

declare module "@mat3ra/code/dist/js/utils" {
    export function deepClone<TValue>(value: TValue): TValue;

    export function safeMakeArray<TItem>(value: TItem | TItem[]): TItem[];
}

declare module "@mat3ra/standata" {
    export class MethodStandata {
        getAll(): unknown[];
    }

    export class ModelStandata {
        getAll(): unknown[];
    }

    export class ModelMethodFilter {
        getCompatibleMethods(model: unknown, methodList: unknown[]): unknown[];
    }
}

