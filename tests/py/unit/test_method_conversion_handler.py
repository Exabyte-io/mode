from mat3ra.mode import MethodConversionHandler


def test_convert_to_simple_psp():
    categorized = {
        "units": [
            {
                "categories": {
                    "type": "psp",
                    "subtype": "us",
                }
            }
        ]
    }

    simple = MethodConversionHandler.convert_to_simple(categorized)

    assert simple["type"] == "pseudopotential"
    assert simple["subtype"] == "us"


def test_convert_to_simple_multiple_psp():
    categorized = {
        "units": [
            {"categories": {"type": "psp", "subtype": "us"}},
            {"categories": {"type": "psp", "subtype": "nc"}},
        ]
    }

    simple = MethodConversionHandler.convert_to_simple(categorized)

    assert simple["type"] == "pseudopotential"
    assert simple["subtype"] == "any"


def test_convert_to_simple_ao():
    categorized = {
        "units": [
            {
                "categories": {
                    "type": "ao",
                    "subtype": "pople",
                }
            }
        ]
    }

    simple = MethodConversionHandler.convert_to_simple(categorized)

    assert simple["type"] == "localorbital"
    assert simple["subtype"] == "pople"


def test_convert_to_simple_unknown():
    simple = MethodConversionHandler.convert_to_simple(None)

    assert simple["type"] == "unknown"
    assert simple["subtype"] == "unknown"


def test_convert_to_categorized_psp():
    simple = {
        "type": "pseudopotential",
        "subtype": "us",
    }

    all_methods = [
        {
            "name": "Pseudopotential US",
            "path": (
                "/qm/wf/none/smearing/gaussian::/linalg/diag/none/davidson/none::"
                "/qm/wf/none/psp/us::/qm/wf/none/pw/none"
            ),
            "units": [],
        }
    ]

    categorized = MethodConversionHandler.convert_to_categorized(simple, all_methods)

    assert categorized is not None
    assert categorized["name"] == "Pseudopotential US"


def test_convert_to_categorized_ao():
    simple = {
        "type": "localorbital",
        "subtype": "pople",
    }

    categorized = MethodConversionHandler.convert_ao_to_categorized(simple)

    assert categorized.name == "Wave function: LCAO - Pople basis set (6-31G)"
    assert len(categorized.units) == 1


def test_convert_to_categorized_regression():
    simple = {
        "type": "linear",
        "subtype": "least_squares",
        "precision": 0.01,
    }

    categorized = MethodConversionHandler.convert_regression_to_categorized(simple)

    assert "regression" in categorized.name.lower()
    assert len(categorized.units) == 1
    assert categorized.units[0]["precision"] == 0.01

