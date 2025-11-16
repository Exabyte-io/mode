import { BaseMethod } from "@mat3ra/esse/dist/js/types";
import { Method } from "../method";
import { PseudopotentialMethod } from "./pseudopotential";
export declare class MethodFactory {
    static Method: typeof Method;
    static PseudopotentialMethod: typeof PseudopotentialMethod;
    static create(config: BaseMethod): Method;
}
