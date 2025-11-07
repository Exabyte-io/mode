"""Tests for Method class."""

import pytest

from mat3ra.mode import Method, PseudopotentialMethod


class TestMethod:
    """Test Method class."""

    def test_can_be_created(self):
        """Test that Method can be created."""
        config = {"type": "pseudopotential", "subtype": "us"}
        method = Method(config)
        assert method.type == "pseudopotential"
        assert method.subtype == "us"

    def test_type_property(self):
        """Test type property returns string."""
        method = Method({"type": "pseudopotential", "subtype": "us"})
        type_value = method.type
        
        assert isinstance(type_value, str)
        assert type_value == "pseudopotential"

    def test_subtype_property(self):
        """Test subtype property."""
        method = Method({"type": "pseudopotential", "subtype": "us"})
        subtype_value = method.subtype
        
        assert subtype_value is not None
        assert subtype_value == "us"

    def test_data_property(self):
        """Test data property."""
        method = Method({
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"key": "value"},
        })
        
        data = method.data
        assert isinstance(data, dict)
        assert data["key"] == "value"

    def test_default_config(self):
        """Test default configuration."""
        config = Method.get_default_config()
        assert "type" in config
        assert "subtype" in config

    def test_set_data(self):
        """Test set_data method."""
        method = Method({"type": "pseudopotential", "subtype": "us"})
        method.set_data({"test": "data"})
        
        assert method.data["test"] == "data"

    def test_set_search_text(self):
        """Test set_search_text method."""
        method = Method({"type": "pseudopotential", "subtype": "us"})
        method.set_search_text("test search")
        
        assert method.search_text == "test search"

    def test_clean_data(self):
        """Test clean_data method."""
        method = Method({
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"field1": "value1", "field2": "value2"},
        })
        
        cleaned = method.clean_data(["field1"])
        assert "field2" in cleaned
        assert "field1" not in cleaned

    def test_to_json(self):
        """Test to_json method."""
        method = Method({
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"key": "value"},
        })
        
        json_data = method.to_json()
        assert json_data["type"] == "pseudopotential"
        assert json_data["subtype"] == "us"
        assert "data" in json_data

    def test_clone_without_data(self):
        """Test clone_without_data method."""
        method = Method({
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"key": "value"},
        })
        
        cloned = method.clone_without_data()
        assert cloned.type == method.type
        assert cloned.data == {}


class TestPseudopotentialMethod:
    """Test PseudopotentialMethod class."""

    def test_can_be_created(self):
        """Test that PseudopotentialMethod can be created."""
        config = {"type": "pseudopotential", "subtype": "us"}
        method = PseudopotentialMethod(config)
        assert method.type == "pseudopotential"

    def test_pseudo_property(self):
        """Test pseudo property."""
        method = PseudopotentialMethod({
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"pseudo": [{"element": "Si"}]},
        })
        
        pseudo = method.pseudo
        assert isinstance(pseudo, list)
        assert len(pseudo) == 1
        assert pseudo[0]["element"] == "Si"

    def test_all_pseudo_property(self):
        """Test all_pseudo property."""
        method = PseudopotentialMethod({
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"allPseudo": [{"element": "Si"}, {"element": "O"}]},
        })
        
        all_pseudo = method.all_pseudo
        assert isinstance(all_pseudo, list)
        assert len(all_pseudo) == 2

    def test_extract_exchange_correlation(self):
        """Test extract_exchange_correlation_from_subworkflow static method."""
        subworkflow = {
            "model": {
                "subtype": "gga",
                "functional": {"slug": "pbe"},
            }
        }
        
        result = PseudopotentialMethod.extract_exchange_correlation_from_subworkflow(subworkflow)
        assert result["approximation"] == "gga"
        assert result["functional"] == "pbe"

    def test_to_json_with_clean_data_excludes_all_pseudo(self):
        """Test that to_json_with_clean_data excludes allPseudo by default."""
        method = PseudopotentialMethod({
            "type": "pseudopotential",
            "subtype": "us",
            "data": {
                "pseudo": [{"element": "Si"}],
                "allPseudo": [{"element": "Si"}, {"element": "O"}],
            },
        })
        
        json_data = method.to_json_with_clean_data()
        assert "allPseudo" not in json_data["data"]
        assert "pseudo" in json_data["data"]
