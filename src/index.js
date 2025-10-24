import { MethodStandata, ModelStandata } from "@mat3ra/standata";

import * as default_methods from "./default_methods";
import * as default_models from "./default_models";
import { Method } from "./method";
import { MethodConversionHandler } from "./methodConversionHandler";
import { MethodFactory } from "./methods/factory";
import { PseudopotentialMethod } from "./methods/pseudopotential";
import { Model } from "./model";
import { ModelConversionHandler } from "./modelConversionHandler";
import { DFTModel } from "./models/dft";
import { ModelFactory } from "./models/factory";
// TODO : can replace these with subpackages in exports in package.json
import * as tree from "./tree";

const methodStandata = new MethodStandata();
const modelStandata = new ModelStandata();

const categorizedMethodList = methodStandata.getAll();
const categorizedModelList = modelStandata.getAll();

export {
    Method,
    Model,
    MethodFactory,
    ModelFactory,
    PseudopotentialMethod,
    DFTModel,
    MethodConversionHandler,
    ModelConversionHandler,
    tree,
    default_models,
    default_methods,
    categorizedModelList,
    categorizedMethodList,
};
