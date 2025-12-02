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
        const tree = (0, tree_1.getTreeByApplicationNameAndVersion)(application);
        if (Object.keys(tree).length === 0) {
            return this.create({ ...config, type: "unknown", subtype: "unknown" });
        }
        const type = (0, tree_1.getDefaultModelTypeForApplication)(application);
        const subtype = (0, tree_1.getDefaultModelSubtypeForApplicationAndType)(application, type) || "unknown";
        return this.create({ ...config, type, subtype });
    }
}
exports.ModelFactory = ModelFactory;
ModelFactory.DFTModel = dft_1.DFTModel;
ModelFactory.Model = model_1.Model;
