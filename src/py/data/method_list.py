"""Method list data."""

all_methods = [
    {
        "units": [
            {
                "categories": {"subtype": "us", "tier1": "qm", "tier2": "wf", "type": "psp"},
                "tags": ["pseudopotential"],
                "name": "Ultra-soft Pseudopotential",
                "path": "/qm/wf/none/psp/us",
            },
            {
                "categories": {"subtype": "nc", "tier1": "qm", "tier2": "wf", "type": "psp"},
                "tags": ["pseudopotential"],
                "name": "Norm-conserving Pseudopotential",
                "path": "/qm/wf/none/psp/nc",
            },
            {
                "categories": {"subtype": "nc-fr", "tier1": "qm", "tier2": "wf", "type": "psp"},
                "tags": ["pseudopotential"],
                "name": "Norm-conserving Fully-relativistic Pseudopotential",
                "path": "/qm/wf/none/psp/nc-fr",
            },
            {
                "categories": {"subtype": "paw", "tier1": "qm", "tier2": "wf", "type": "psp"},
                "tags": ["pseudopotential"],
                "name": "Projector-augmented wave Pseudopotential",
                "path": "/qm/wf/none/psp/paw",
            },
            {
                "categories": {"tier1": "qm", "tier2": "wf", "type": "pw"},
                "tags": ["plane wave"],
                "name": "Wave function: Plane wave",
                "path": "/qm/wf/none/pw/none",
            },
        ],
        "name": "Any Plane-wave Pseudopotential Method",
        "path": "/qm/wf/none/psp/us::/qm/wf/none/psp/nc::/qm/wf/none/psp/nc-fr::/qm/wf/none/psp/paw::/qm/wf/none/pw/none",
    },
    {
        "units": [
            {
                "categories": {"subtype": "least_squares", "type": "linear"},
                "tags": ["exabyteML"],
                "name": "Linear least squares regression",
                "path": "/none/none/none/linear/least_squares",
            }
        ],
        "name": "Linear least squares regression",
        "path": "/none/none/none/linear/least_squares",
    },
    {
        "units": [
            {
                "categories": {"subtype": "ridge", "type": "linear"},
                "tags": ["exabyteML"],
                "name": "Linear ridge regression",
                "path": "/none/none/none/linear/ridge",
            }
        ],
        "name": "Linear ridge regression",
        "path": "/none/none/none/linear/ridge",
    },
    {
        "units": [
            {
                "categories": {"type": "kernel_ridge", "subtype": "least_squares"},
                "tags": ["exabyteML"],
                "name": "Kernel Ridge least squares regression",
                "path": "/none/none/none/kernel_ridge/least_squares",
            }
        ],
        "name": "Kernel Ridge least squares regression",
        "path": "/none/none/none/kernel_ridge/least_squares",
    },
    {
        "units": [
            {
                "parameters": {"basisSlug": "6-31G"},
                "categories": {"tier1": "qm", "tier2": "wf", "type": "ao", "subtype": "pople"},
                "tags": ["atomic orbital"],
                "name": "Wave function: LCAO - Pople basis set (6-31G)",
                "path": "/qm/wf/none/ao/pople?basisSlug=6-31G",
            }
        ],
        "name": "Wave function: LCAO - Pople basis set (6-31G)",
        "path": "/qm/wf/none/ao/pople?basisSlug=6-31G",
    },
    {
        "units": [
            {
                "categories": {"subtype": "gaussian", "tier1": "qm", "tier2": "wf", "type": "smearing"},
                "tags": ["occupation number"],
                "name": "Gaussian Smearing",
                "path": "/qm/wf/none/smearing/gaussian",
            },
            {
                "categories": {"tier1": "opt", "tier2": "diff", "tier3": "ordern", "type": "cg"},
                "tags": ["diagonalization"],
                "name": "Conjugate Gradient Diagonalization",
                "path": "/opt/diff/ordern/cg/none",
            },
            {
                "categories": {"subtype": "us", "tier1": "qm", "tier2": "wf", "type": "psp"},
                "tags": ["pseudopotential"],
                "name": "Ultra-soft Pseudopotential",
                "path": "/qm/wf/none/psp/us",
            },
            {
                "categories": {"tier1": "qm", "tier2": "wf", "type": "pw"},
                "tags": ["plane wave"],
                "name": "Wave function: Plane wave",
                "path": "/qm/wf/none/pw/none",
            },
        ],
        "name": "Plane-wave Ultra-soft Pseudopotential (Conjugate Gradient Diagonalization, Gaussian Smearing)",
        "path": "/qm/wf/none/smearing/gaussian::/opt/diff/ordern/cg/none::/qm/wf/none/psp/us::/qm/wf/none/pw/none",
    },
    # Additional methods would continue here...
    # For brevity, I'm including just a representative sample
]

