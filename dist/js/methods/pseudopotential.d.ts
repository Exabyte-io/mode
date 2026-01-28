import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import { type SubworkflowSchema, BaseMethod } from "@mat3ra/esse/dist/js/types";
import { Method } from "../method";
import type { PseudopotentialCtor, PseudopotentialLike } from "../types";
export declare class PseudopotentialMethod extends Method {
    PseudopotentialCls: PseudopotentialCtor | null;
    constructor(config: BaseMethod);
    toJSON: () => BaseMethod & AnyObject;
    get pseudo(): Record<string, unknown>[];
    get allPseudo(): Record<string, unknown>[];
    get pseudopotentials(): PseudopotentialLike[];
    get allPseudopotentials(): PseudopotentialLike[];
    static extractExchangeCorrelationFromSubworkflow(subworkflow: SubworkflowSchema): {
        approximation: string;
        functional: string;
    };
    hasPseudopotentialFor(element: string): boolean;
    setPseudopotentialPerElement(pseudo: PseudopotentialLike | undefined): void;
    addToAllPseudos(pseudos: PseudopotentialLike | PseudopotentialLike[]): void;
    setPseudopotentials(pseudopotentials: PseudopotentialLike[]): void;
    setAllPseudopotentials(pseudopotentials: PseudopotentialLike[]): void;
    toJSONWithCleanData(exclude?: string[]): BaseMethod;
}
