"""Model list data."""

all_models = [
    {
        "parameters": {"spinOrbitCoupling": True, "dispersionCorrection": "dft-d3", "functional": "pbe"},
        "categories": {"tier1": "pb", "tier2": "qm", "tier3": "dft", "type": "ksdft", "subtype": "gga"},
        "tags": ["density functional theory"],
        "name": "DFT GGA PBE-D3 (SOC)",
        "path": "/pb/qm/dft/ksdft/gga?spinOrbitCoupling=true&dispersionCorrection=dft-d3&functional=pbe",
    },
    {
        "parameters": {"spinPolarization": "collinear", "dispersionCorrection": "dft-d3", "functional": "pbe"},
        "categories": {"tier1": "pb", "tier2": "qm", "tier3": "dft", "type": "ksdft", "subtype": "gga"},
        "tags": ["density functional theory"],
        "name": "DFT GGA PBE-D3 (collinear)",
        "path": "/pb/qm/dft/ksdft/gga?spinPolarization=collinear&dispersionCorrection=dft-d3&functional=pbe",
    },
    {
        "parameters": {"dispersionCorrection": "dft-d3", "functional": "pbe"},
        "categories": {"tier1": "pb", "tier2": "qm", "tier3": "dft", "type": "ksdft", "subtype": "gga"},
        "tags": ["density functional theory"],
        "name": "DFT GGA PBE-D3",
        "path": "/pb/qm/dft/ksdft/gga?dispersionCorrection=dft-d3&functional=pbe",
    },
    {
        "parameters": {"hubbardType": "u", "spinOrbitCoupling": True, "functional": "pbe"},
        "categories": {"tier1": "pb", "tier2": "qm", "tier3": "dft", "type": "ksdft", "subtype": "gga"},
        "tags": ["density functional theory"],
        "name": "DFT GGA PBE+U (SOC)",
        "path": "/pb/qm/dft/ksdft/gga?hubbardType=u&spinOrbitCoupling=true&functional=pbe",
    },
    {
        "parameters": {"spinOrbitCoupling": True, "functional": "pbe"},
        "categories": {"tier1": "pb", "tier2": "qm", "tier3": "dft", "type": "ksdft", "subtype": "gga"},
        "tags": ["density functional theory"],
        "name": "DFT GGA PBE (SOC)",
        "path": "/pb/qm/dft/ksdft/gga?spinOrbitCoupling=true&functional=pbe",
    },
    {
        "parameters": {"spinPolarization": "collinear", "hubbardType": "u", "functional": "pbe"},
        "categories": {"tier1": "pb", "tier2": "qm", "tier3": "dft", "type": "ksdft", "subtype": "gga"},
        "tags": ["density functional theory"],
        "name": "DFT GGA PBE+U (collinear)",
        "path": "/pb/qm/dft/ksdft/gga?spinPolarization=collinear&hubbardType=u&functional=pbe",
    },
    {
        "parameters": {"hubbardType": "u", "functional": "pbe"},
        "categories": {"tier1": "pb", "tier2": "qm", "tier3": "dft", "type": "ksdft", "subtype": "gga"},
        "tags": ["density functional theory"],
        "name": "DFT GGA PBE+U",
        "path": "/pb/qm/dft/ksdft/gga?hubbardType=u&functional=pbe",
    },
    {
        "parameters": {"spinPolarization": "collinear", "functional": "pbe"},
        "categories": {"tier1": "pb", "tier2": "qm", "tier3": "dft", "type": "ksdft", "subtype": "gga"},
        "tags": ["density functional theory"],
        "name": "DFT GGA PBE (collinear)",
        "path": "/pb/qm/dft/ksdft/gga?spinPolarization=collinear&functional=pbe",
    },
    {
        "parameters": {"functional": "pbe"},
        "categories": {"tier1": "pb", "tier2": "qm", "tier3": "dft", "type": "ksdft", "subtype": "gga"},
        "tags": ["density functional theory"],
        "name": "DFT GGA PBE",
        "path": "/pb/qm/dft/ksdft/gga?functional=pbe",
    },
    {
        "parameters": {"functional": "pbe", "require": "pb/qm/dft/ksdft/gga?functional=pbe"},
        "categories": {"subtype": "g0w0", "tier1": "pb", "tier2": "qm", "tier3": "abin", "type": "gw"},
        "name": "G0W0@PBE",
        "path": "/pb/qm/abin/gw/g0w0?functional=pbe&require=pb%2Fqm%2Fdft%2Fksdft%2Fgga%3Ffunctional%3Dpbe",
    },
    {
        "categories": {"tier1": "st", "tier2": "det", "tier3": "ml", "type": "re"},
        "parameters": {},
        "name": "Regression",
        "path": "/st/det/ml/re/none",
    },
    # Additional models would continue here...
    # For brevity, I'm including just a representative sample
]

