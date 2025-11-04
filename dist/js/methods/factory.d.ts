import { Method } from "../method";
import type { MethodConfig } from "../types";
import { PseudopotentialMethod } from "./pseudopotential";
export declare class MethodFactory {
    static Method: typeof Method;
    static PseudopotentialMethod: typeof PseudopotentialMethod;
    static create(config: MethodConfig): Method;
}
//# sourceMappingURL=factory.d.ts.map