import { Model } from "../model";
import type { ModelConfig, RequireFields } from "../types";
import { DFTModel } from "./dft";
export declare class ModelFactory {
    static DFTModel: typeof DFTModel;
    static Model: typeof Model;
    static create(config: ModelConfig): Model;
    static createFromApplication(config: RequireFields<ModelConfig, "application">): Model;
}
