"""Tests for conversion handlers."""

import pytest

from mat3ra.mode import MethodConversionHandler, ModelConversionHandler


class TestModelConversionHandler:
    """Test ModelConversionHandler class."""

    def test_convert_to_simple_dft(self):
        """Test converting DFT categorized model to simple."""
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
        assert simple["functional"]["slug"] == "pbe"

    def test_convert_to_simple_ml(self):
        """Test converting ML categorized model to simple."""
        categorized = {
            "categories": {
                "tier3": "ml",
            },
        }
        
        simple = ModelConversionHandler.convert_to_simple(categorized)
        
        assert simple["type"] == "ml"
        assert simple["subtype"] == "re"

    def test_convert_to_simple_unknown(self):
        """Test converting unknown model to simple."""
        simple = ModelConversionHandler.convert_to_simple(None)
        
        assert simple["type"] == "unknown"
        assert simple["subtype"] == "unknown"

    def test_convert_to_categorized_dft(self):
        """Test converting simple DFT model to categorized."""
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

    def test_convert_to_categorized_ml(self):
        """Test converting simple ML model to categorized."""
        simple = {
            "type": "ml",
            "subtype": "re",
        }
        
        categorized = ModelConversionHandler.convert_ml_to_categorized(simple)
        
        assert categorized.name == "Regression"
        assert categorized.path == "/st/det/ml/re/none"


class TestMethodConversionHandler:
    """Test MethodConversionHandler class."""

    def test_convert_to_simple_psp(self):
        """Test converting pseudopotential categorized method to simple."""
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

    def test_convert_to_simple_multiple_psp(self):
        """Test converting multiple pseudopotential units to simple."""
        categorized = {
            "units": [
                {"categories": {"type": "psp", "subtype": "us"}},
                {"categories": {"type": "psp", "subtype": "nc"}},
            ]
        }
        
        simple = MethodConversionHandler.convert_to_simple(categorized)
        
        assert simple["type"] == "pseudopotential"
        assert simple["subtype"] == "any"

    def test_convert_to_simple_ao(self):
        """Test converting atomic orbital categorized method to simple."""
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

    def test_convert_to_simple_unknown(self):
        """Test converting unknown method to simple."""
        simple = MethodConversionHandler.convert_to_simple(None)
        
        assert simple["type"] == "unknown"
        assert simple["subtype"] == "unknown"

    def test_convert_to_categorized_psp(self):
        """Test converting simple pseudopotential method to categorized."""
        simple = {
            "type": "pseudopotential",
            "subtype": "us",
        }
        
        all_methods = [
            {
                "name": "Pseudopotential US",
                "path": "/qm/wf/none/smearing/gaussian::/linalg/diag/none/davidson/none::/qm/wf/none/psp/us::/qm/wf/none/pw/none",
                "units": [],
            }
        ]
        
        categorized = MethodConversionHandler.convert_to_categorized(simple, all_methods)
        
        assert categorized is not None
        assert categorized.name == "Pseudopotential US"

    def test_convert_to_categorized_ao(self):
        """Test converting simple atomic orbital method to categorized."""
        simple = {
            "type": "localorbital",
            "subtype": "pople",
        }
        
        categorized = MethodConversionHandler.convert_ao_to_categorized(simple)
        
        assert categorized.name == "Wave function: LCAO - Pople basis set (6-31G)"
        assert len(categorized.units) == 1

    def test_convert_to_categorized_regression(self):
        """Test converting simple regression method to categorized."""
        simple = {
            "type": "linear",
            "subtype": "least_squares",
            "precision": 0.01,
        }
        
        categorized = MethodConversionHandler.convert_regression_to_categorized(simple)
        
        assert "regression" in categorized.name.lower()
        assert len(categorized.units) == 1
        assert categorized.units[0]["precision"] == 0.01
