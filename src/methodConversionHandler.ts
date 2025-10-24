// @ts-nocheck
import {
    BaseMethod,
    CategorizedMethod,
    LegacyMethodLocalorbital,
    LegacyMethodPseudopotential,
    LegacyMethodRegression,
    LegacyMethodUnknown,
    UnitMethodPseudopotential,
    UnitMethodRegression,
} from "@mat3ra/esse/dist/js/types";
import { categorizedMethodList } from "@mat3ra/mode";
import { LocalOrbitalMethodConfig, UnknownMethodConfig } from "@mat3ra/mode/dist/default_methods";

export function safelyGetSlug(slugObj: { slug: string } | string): string {
    return typeof slugObj === "string" ? slugObj : slugObj.slug;
}


/**
 * The method interface converts between the legacy method data structure (type, subtype)
 * and the categorized method data structure (units with tier1, tier2, ...).
 */
export class MethodConversionHandler {
    static convertToSimple(cm: CategorizedMethod | undefined): BaseMethod {
        if (!cm) return this.convertUnknownToSimple();
        const pspUnits = cm.units.filter((u) => u.categories.type === "psp");
        const aoUnit = cm.units.find((u) => u.categories.type === "ao");
        const reUnit = cm.units.find(
            (u) => u.name && u.name.includes("regression"),
        ) as UnitMethodRegression;
        if (pspUnits.length) return this.convertPspUnitsToSimple(pspUnits);
        if (aoUnit) return this.convertAoUnitToSimple();
        if (reUnit) return this.convertRegressionUnitToSimple(reUnit);
        return this.convertRegressionUnitToSimple(reUnit);
    }

    static convertUnknownToSimple(): LegacyMethodUnknown {
        return UnknownMethodConfig;
    }

    static convertPspUnitsToSimple(
        cm: UnitMethodPseudopotential[],
    ): LegacyMethodUnknown | LegacyMethodPseudopotential {
        const [firstPspUnit, ...otherUnits] = cm;
        if (!firstPspUnit || !firstPspUnit.categories?.subtype)
            return this.convertUnknownToSimple();
        const subtype = otherUnits?.length ? "any" : firstPspUnit.categories.subtype;
        return {
            type: "pseudopotential",
            subtype,
        } as LegacyMethodPseudopotential;
    }

    static convertAoUnitToSimple(): LegacyMethodLocalorbital {
        return LocalOrbitalMethodConfig;
    }

    static convertRegressionUnitToSimple(cm: UnitMethodRegression): LegacyMethodRegression {
        const type = cm.categories.type || "linear";
        const subtype = cm.categories.subtype || "least_squares";
        return {
            type: safelyGetSlug(type) as "linear" | "kernel_ridge",
            subtype: safelyGetSlug(subtype) as "least_squares" | "ridge",
            data: cm.data,
            precision: cm.precision,
        };
    }

    static convertToCategorized(sm?: BaseMethod): CategorizedMethod | undefined {
    switch (sm?.type) {
    case "pseudopotential":
    return this.convertPspToCategorized(sm as LegacyMethodPseudopotential);
    case "localorbital":
    return this.convertAoToCategorized(sm as LegacyMethodLocalorbital);
    case "linear":
    return this.convertRegressionToCategorized(sm as LegacyMethodRegression);
    case "kernel_ridge":
    return this.convertRegressionToCategorized(sm as LegacyMethodRegression);
    default:
    return undefined;
}
}

static convertPspToCategorized(sm: LegacyMethodPseudopotential): CategorizedMethod {
    const subtype = safelyGetSlug(sm.subtype);
    // the "any" subtype is equivalent to the method representing all planewave-pseudopotential
    // methods. All other subtypes are equivalent to using a specific PW-PSP method.
    const path =
        subtype === "any"
            ? "/qm/wf/none/psp/us::/qm/wf/none/psp/nc::/qm/wf/none/psp/nc-fr::/qm/wf/none/psp/paw::/qm/wf/none/pw/none"
            : `/qm/wf/none/smearing/gaussian::/linalg/diag/none/davidson/none::/qm/wf/none/psp/${subtype}::/qm/wf/none/pw/none`;

    return categorizedMethodList.find((catMethod) => {
        return catMethod.path === path;
    });
}

static convertAoToCategorized(sm: LegacyMethodLocalorbital): CategorizedMethod {
    const subtype = safelyGetSlug(sm.subtype);
    return {
        units: [
            {
                parameters: { basisSlug: "6-31G" },
                categories: { tier1: "qm", tier2: "wf", type: "ao", subtype },
                tags: ["atomic orbital"],
                name: "Wave function: LCAO - Pople basis set (6-31G)",
                path: "/qm/wf/none/ao/pople?basisSlug=6-31G",
            },
        ],
        name: "Wave function: LCAO - Pople basis set (6-31G)",
        path: "/qm/wf/none/ao/pople?basisSlug=6-31G",
    };
}

static convertRegressionToCategorized(sm: LegacyMethodRegression): CategorizedMethod {
    const type = safelyGetSlug(sm.type);
    const subtype = safelyGetSlug(sm.subtype);
    const { precision, data } = sm;
    const path = `/none/none/none/${type}/${subtype}`;
    const nameMap = {
        kernel_ridge: "Kernel ridge",
        linear: "Linear",
        least_squares: "least squares",
        ridge: "ridge",
    };
    const name = `${nameMap[type]} ${nameMap[subtype]} regression`;
    return {
        units: [
            {
                categories: { type, subtype },
                name,
                path,
                precision,
                data,
            },
        ],
        name,
        path,
    };
}
}
