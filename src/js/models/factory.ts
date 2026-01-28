import type { ApplicationSchema } from "@mat3ra/esse/dist/js/types";

import { Model } from "../model";
import {
    getDefaultModelTypeSubtypeForApplication,
    getTreeByApplicationNameAndVersion,
} from "../tree";
import type { ModelConfig } from "../types";
import { DFTModel } from "./dft";

export type ModelConfigFromApplication = Partial<ModelConfig> & { application: ApplicationSchema };

export class ModelFactory {
    static DFTModel = DFTModel;

    static Model = Model;

    static create(config: ModelConfig): Model {
        switch (config.type) {
            case "dft":
                return new this.DFTModel(config);
            default:
                return new this.Model(config);
        }
    }

    static createFromApplication(config: ModelConfigFromApplication): Model {
        const { application } = config;
        if (!application) {
            throw new Error("ModelFactory.createFromApplication: application is required");
        }

        const tree = getTreeByApplicationNameAndVersion(application);
        if (!tree || Object.keys(tree).length === 0) {
            return this.create({ ...config, type: "unknown", subtype: "unknown" });
        }

        const typeSubtype = getDefaultModelTypeSubtypeForApplication(application);

        return this.create({ ...config, ...typeSubtype });
    }
}
