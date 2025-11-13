"""Tests for ModelConversionHandler."""

from mat3ra.mode import ModelConversionHandler


def test_convert_to_simple_dft():
    categorized = {
        "categories": {
            "tier3": "dft",
            "subtype": "gga",
        },
        "parameters": {
            "functional": {"slug": "pbe"},
        },
    }

    simple = ModelConversionHandler.convert_to_simple(categorized)

    assert simple["type"] == "dft"
    assert simple["subtype"] == "gga"
    assert simple["functional"].slug == "pbe"


def test_convert_to_simple_ml():
    categorized = {
        "categories": {
            "tier3": "ml",
        },
    }

    simple = ModelConversionHandler.convert_to_simple(categorized)

    assert simple["type"] == "ml"
    assert simple["subtype"] == "re"


def test_convert_to_simple_unknown():
    simple = ModelConversionHandler.convert_to_simple(None)

    assert simple["type"] == "unknown"
    assert simple["subtype"] == "unknown"


def test_convert_to_categorized_dft():
    simple = {
        "type": "dft",
        "subtype": "gga",
        "functional": {"slug": "pbe"},
    }

    all_models = [
        {
            "name": "DFT GGA PBE",
            "path": "/pb/qm/dft/ksdft/gga?functional=pbe",
            "categories": {"tier3": "dft", "subtype": "gga"},
            "parameters": {"functional": "pbe"},
        }
    ]

    categorized = ModelConversionHandler.convert_to_categorized(simple, all_models)

    assert categorized is not None
    assert categorized.name == "DFT GGA PBE"


def test_convert_to_categorized_ml():
    simple = {
        "type": "ml",
        "subtype": "re",
    }

    categorized = ModelConversionHandler.convert_ml_to_categorized(simple)

    assert categorized.name == "Regression"
    assert categorized.path == "/st/det/ml/re/none"

