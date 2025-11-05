"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodFactory = void 0;
const method_1 = require("../method");
const pseudopotential_1 = require("./pseudopotential");
class MethodFactory {
    static create(config) {
        switch (config.type) {
            case "pseudopotential":
                return new this.PseudopotentialMethod(config);
            default:
                return new this.Method(config);
        }
    }
}
exports.MethodFactory = MethodFactory;
MethodFactory.Method = method_1.Method;
MethodFactory.PseudopotentialMethod = pseudopotential_1.PseudopotentialMethod;
