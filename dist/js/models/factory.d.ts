import type { ApplicationSchema } from "@mat3ra/esse/dist/js/types";
import { Model } from "../model";
import type { ModelConfig } from "../types";
import { DFTModel } from "./dft";
export declare class ModelFactory {
    static DFTModel: typeof DFTModel;
    static Model: typeof Model;
    static create(config: ModelConfig): Model;
    static createFromApplication(config: ModelConfig & {
        application: ApplicationSchema;
    }): Model;
}
