import { PseudopotentialMetaProperty } from "@mat3ra/prode";
import { expect } from "chai";

import { PseudopotentialMethod } from "../../src/js/methods/pseudopotential";

describe("PseudopotentialMethod.updateMethodDataByApplicationAndMaterials", () => {
    const exchangeCorrelation = {
        functional: "pbe" as const,
        approximation: "gga" as const,
    };

    const methodDataItems = [
        new PseudopotentialMetaProperty({
            exchangeCorrelation,
            element: "Si",
            hash: "us-hash",
            path: "/export/share/pseudo/si/gga/pbe/gbrv/1.0/us/si_pbe_gbrv_1.0.upf",
            filename: "si_pbe_gbrv_1.0.upf",
            apps: ["espresso"],
            source: "gbrv",
            type: "us",
        }),
        new PseudopotentialMetaProperty({
            exchangeCorrelation,
            element: "Si",
            hash: "nc-hash",
            path: "/export/share/pseudo/si/gga/pbe/dojo-oncv/0.4/nc/si_pbe_dojo-oncv_0.4.upf",
            filename: "si_pbe_dojo-oncv_0.4.upf",
            apps: ["espresso"],
            source: "dojo-oncv",
            type: "nc",
        }),
    ];

    it("selects norm-conserving pseudos when method subtype is nc", () => {
        const method = new PseudopotentialMethod({
            type: "pseudopotential",
            subtype: "nc",
            data: {},
        });

        method.updateMethodDataByApplicationAndMaterials(methodDataItems, {
            elements: ["Si"],
            appName: "espresso",
            exchangeCorrelation,
        });

        expect(method.pseudopotentials).to.have.length(1);
        expect(method.pseudopotentials[0].type).to.equal("nc");
        expect(method.pseudopotentials[0].filename).to.equal("si_pbe_dojo-oncv_0.4.upf");
    });

    it("prefers gbrv ultrasoft pseudos when method subtype is us", () => {
        const method = new PseudopotentialMethod({
            type: "pseudopotential",
            subtype: "us",
            data: {},
        });

        method.updateMethodDataByApplicationAndMaterials(methodDataItems, {
            elements: ["Si"],
            appName: "espresso",
            exchangeCorrelation,
        });

        expect(method.pseudopotentials).to.have.length(1);
        expect(method.pseudopotentials[0].type).to.equal("us");
        expect(method.pseudopotentials[0].filename).to.equal("si_pbe_gbrv_1.0.upf");
    });
});
