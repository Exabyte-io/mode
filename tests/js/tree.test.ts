import { expect } from "chai";

import {
    getDefaultModelTypeSubtypeForApplication,
    getTreeByApplicationNameAndVersion,
} from "../../src/js/tree";

const testCasesAppNameAndVersion = [
    {
        app: { name: "espresso", version: "6.3" },
        expectedKeys: ["dft"],
        expectedSubkeys: ["gga", "lda", "hybrid"],
    },
    {
        app: { name: "vasp", version: "5.4.4" },
        expectedKeys: ["dft"],
    },
    {
        app: { name: "python", version: "3.8.6" },
        expectedKeys: ["unknown"],
        expectedSubkeys: ["unknown"],
    },
];

const testCasesDefaultSubtype = [
    {
        app: { name: "espresso", version: "6.3" },
        expected: { type: "dft", subtype: "gga" },
    },
    {
        app: { name: "vasp", version: "5.4.4" },
        expected: { type: "dft", subtype: "gga" },
    },
    {
        app: { name: "nwchem", version: "7.0.2" },
        expected: { type: "dft", subtype: "gga" },
    },
    {
        app: { name: "python", version: "3.8.6" },
        expected: { type: "unknown", subtype: "unknown" },
    },
    {
        app: { name: "shell", version: "0.0.1" },
        expected: { type: "unknown", subtype: "unknown" },
    },
];

describe("tree", () => {
    it("can getTreeByApplicationNameAndVersion", () => {
        testCasesAppNameAndVersion.forEach(({ app, expectedKeys, expectedSubkeys }) => {
            const tree = getTreeByApplicationNameAndVersion(app);
            expect(tree).to.be.an("object");
            expect(Object.keys(tree || {})).to.have.length(expectedKeys.length);

            expectedKeys.forEach((key) => {
                expect(tree).to.have.property(key);
            });

            if (expectedSubkeys && expectedKeys[0]) {
                expectedSubkeys.forEach((subkey) => {
                    expect(tree?.[expectedKeys[0]]).to.have.property(subkey);
                });
            }
        });
    });

    it("can getDefaultModelTypeSubtypeForApplication", () => {
        testCasesDefaultSubtype.forEach(({ app, expected }) => {
            const subtype = getDefaultModelTypeSubtypeForApplication(app);
            expect(subtype).to.deep.equal(expected);
        });
    });
});
