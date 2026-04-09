import type { AnyObject } from "@mat3ra/esse/dist/js/esse/types";
import { type BaseMethod, type FileDataItem } from "@mat3ra/esse/dist/js/types";
import { PseudopotentialFilter, PseudopotentialMetaProperty } from "@mat3ra/prode";
import { Method } from "../method";
export type ExchangeCorrelation = {
    approximation: string;
    functional: string;
};
export declare class PseudopotentialMethod extends Method {
    toJSON: () => BaseMethod & AnyObject;
    get pseudo(): FileDataItem[];
    get allPseudo(): FileDataItem[];
    get pseudopotentials(): PseudopotentialMetaProperty[];
    get allPseudopotentials(): PseudopotentialMetaProperty[];
    hasPseudopotentialFor(element: string): boolean;
    setPseudopotentialPerElement(pseudo?: PseudopotentialMetaProperty): void;
    addToAllPseudos(pseudos: PseudopotentialMetaProperty | PseudopotentialMetaProperty[]): void;
    setPseudopotentials(pseudopotentials: PseudopotentialMetaProperty[]): void;
    setAllPseudopotentials(pseudopotentials: PseudopotentialMetaProperty[]): void;
    toJSONWithCleanData(exclude?: string[]): BaseMethod;
    updateMethodDataByApplicationAndMaterials(methodDataItems: PseudopotentialMetaProperty[], pseudoFilter: Pick<PseudopotentialFilter, "elements" | "appName" | "exchangeCorrelation">): this;
}
