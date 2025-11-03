import { Method } from "../method";
import type { MethodConfig } from "../types";
import { PseudopotentialMethod } from "./pseudopotential";

export class MethodFactory {
    static Method = Method;

    static PseudopotentialMethod = PseudopotentialMethod;

    static create(config: MethodConfig): Method {
        switch (config.type) {
            case "pseudopotential":
                return new this.PseudopotentialMethod(config);
            default:
                return new this.Method(config);
        }
    }
}

