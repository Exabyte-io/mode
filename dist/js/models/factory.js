"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelFactory = void 0;
const model_1 = require("../model");
const tree_1 = require("../tree");
const dft_1 = require("./dft");
class ModelFactory {
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
        if (!application) {
            throw new Error("ModelFactory.createFromApplication: application is required");
        }
        const type = (0, tree_1.getDefaultModelTypeForApplication)(application);
        if (!type) {
            throw new Error(
                `ModelFactory.createFromApplication: cannot determine model type: ${type}`,
            );
        }
        return this.create({ ...config, type });
    }
}
exports.ModelFactory = ModelFactory;
ModelFactory.DFTModel = dft_1.DFTModel;
ModelFactory.Model = model_1.Model;
