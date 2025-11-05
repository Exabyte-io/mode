"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodConversionHandler = void 0;
exports.safelyGetSlug = safelyGetSlug;
const default_methods_1 = require("./default_methods");
function safelyGetSlug(slugObj) {
    return typeof slugObj === "string" ? slugObj : slugObj.slug;
}
class MethodConversionHandler {
    static convertToSimple(categorizedMethod) {
        if (!categorizedMethod) return this.convertUnknownToSimple();
        const pspUnits = categorizedMethod.units.filter((unit) => {
            var _a;
            return ((_a = unit.categories) === null || _a === void 0 ? void 0 : _a.type) === "psp";
        });
        const aoUnit = categorizedMethod.units.find((unit) => {
            var _a;
            return ((_a = unit.categories) === null || _a === void 0 ? void 0 : _a.type) === "ao";
        });
        const regressionUnit = categorizedMethod.units.find((unit) => {
            return unit.name && unit.name.includes("regression");
        });
        if (pspUnits.length) return this.convertPspUnitsToSimple(pspUnits);
        if (aoUnit) return this.convertAoUnitToSimple();
        if (regressionUnit) return this.convertRegressionUnitToSimple(regressionUnit);
        return this.convertUnknownToSimple();
    }
    static convertUnknownToSimple() {
        return default_methods_1.UnknownMethodConfig;
    }
    static convertPspUnitsToSimple(units) {
        var _a;
        const [firstUnit, ...otherUnits] = units;
        if (
            !firstUnit ||
            !((_a = firstUnit.categories) === null || _a === void 0 ? void 0 : _a.subtype)
        )
            return this.convertUnknownToSimple();
        const subtype = otherUnits.length ? "any" : safelyGetSlug(firstUnit.categories.subtype);
        return {
            type: "pseudopotential",
            subtype,
        };
    }
    static convertAoUnitToSimple() {
        return default_methods_1.LocalOrbitalMethodConfig;
    }
    static convertRegressionUnitToSimple(unit) {
        var _a, _b;
        const type =
            ((_a = unit.categories) === null || _a === void 0 ? void 0 : _a.type) || "linear";
        const subtype =
            ((_b = unit.categories) === null || _b === void 0 ? void 0 : _b.subtype) ||
            "least_squares";
        return {
            type: safelyGetSlug(type),
            subtype: safelyGetSlug(subtype),
            precision: unit.precision,
        };
    }
    static convertToCategorized(simpleMethod, allMethods = []) {
        switch (simpleMethod === null || simpleMethod === void 0 ? void 0 : simpleMethod.type) {
            case "pseudopotential":
                return this.convertPspToCategorized(simpleMethod, allMethods);
            case "localorbital":
                return this.convertAoToCategorized(simpleMethod);
            case "linear":
            case "kernel_ridge":
                return this.convertRegressionToCategorized(simpleMethod);
            default:
                return undefined;
        }
    }
    static convertPspToCategorized(simpleMethod, allMethods = []) {
        const subtype = safelyGetSlug(simpleMethod.subtype);
        // the "any" subtype is equivalent to the method representing all planewave-pseudopotential
        // methods. All other subtypes are equivalent to using a specific PW-PSP method.
        const allPath =
            "/qm/wf/none/psp/us::/qm/wf/none/psp/nc::/qm/wf/none/psp/nc-fr::/qm/wf/none/psp/paw::/qm/wf/none/pw/none";
        const path =
            subtype === "any"
                ? allPath
                : `/qm/wf/none/smearing/gaussian::/linalg/diag/none/davidson/none::/qm/wf/none/psp/${subtype}::/qm/wf/none/pw/none`;
        return allMethods.find((categorized) => categorized.path === path);
    }
    static convertAoToCategorized(simpleMethod) {
        const subtype = safelyGetSlug(simpleMethod.subtype);
        return {
            units: [
                {
                    parameters: {
                        basisSlug: "6-31G",
                    },
                    categories: {
                        tier1: "qm",
                        tier2: "wf",
                        type: "ao",
                        subtype,
                    },
                    tags: ["atomic orbital"],
                    name: "Wave function: LCAO - Pople basis set (6-31G)",
                    path: "/qm/wf/none/ao/pople?basisSlug=6-31G",
                },
            ],
            name: "Wave function: LCAO - Pople basis set (6-31G)",
            path: "/qm/wf/none/ao/pople?basisSlug=6-31G",
        };
    }
    static convertRegressionToCategorized(simpleMethod) {
        const type = safelyGetSlug(simpleMethod.type);
        const subtype = safelyGetSlug(simpleMethod.subtype);
        const precision = simpleMethod.precision;
        const path = `/none/none/none/${type}/${subtype}`;
        const nameMap = {
            kernel_ridge: "Kernel ridge",
            linear: "Linear",
            least_squares: "least squares",
            ridge: "ridge",
        };
        const name = `${nameMap[type] || type} ${nameMap[subtype] || subtype} regression`;
        return {
            units: [
                {
                    categories: {
                        type,
                        subtype,
                    },
                    name,
                    path,
                    precision,
                },
            ],
            name,
            path,
        };
    }
}
exports.MethodConversionHandler = MethodConversionHandler;
