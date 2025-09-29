import { Model } from "../model";
import { getDefaultModelTypeForApplication } from "../tree";
import { DFTModel } from "./dft";

export class ModelFactory {
    static DFTModel = DFTModel;

    static Model = Model;

    static create(config) {
        switch (config.type) {
            case "dft":
                return new this.DFTModel(config);
            default:
                return new this.Model(config);
        }
    }

    static createFromApplication(config) {
        const { application } = config;
        const type = application && getDefaultModelTypeForApplication(application);
        if (!type)
            throw new Error(
                `ModelFactory.createFromApplication: cannot determine model type: ${type}`,
            );
        return this.create({ ...config, type });
    }
}
