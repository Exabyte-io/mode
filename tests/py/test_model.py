"""Tests for Model class."""

from mat3ra.mode import DFTModel, Method, Model


class TestModel:
    """Test Model class."""

    def test_can_be_created(self):
        """Test that Model can be created."""
        config = {"type": "dft", "subtype": "gga"}
        model = Model.create(config)
        assert model.type == "dft"
        assert model.subtype == "gga"

    def test_type_property(self):
        """Test type property returns string."""
        model = Model.create({"type": "dft", "subtype": "gga"})
        type_value = model.type

        assert isinstance(type_value, str)
        assert type_value == "dft"

    def test_subtype_property(self):
        """Test subtype property."""
        model = Model.create({"type": "dft", "subtype": "gga"})
        subtype_value = model.subtype

        assert subtype_value is not None
        assert subtype_value == "gga"

    def test_method_property_returns_method_instance(self):
        """Test that method property returns Method instance."""
        model = Model.create(
            {
                "type": "dft",
                "subtype": "gga",
                "method": {"type": "pseudopotential", "subtype": "nc"},
            }
        )

        method_value = model.Method

        # Check that method is an instance, not a plain dict
        assert method_value is not None
        assert isinstance(method_value, Method)

        # Check that it has Method class properties and methods
        assert hasattr(method_value, "data")
        assert hasattr(method_value, "search_text")
        assert hasattr(method_value, "to_json")

    def test_default_config(self):
        """Test default configuration."""
        config = Model.get_default_config()
        assert "type" in config
        assert "subtype" in config
        assert "method" in config

    def test_to_json(self):
        """Test to_dict method (to_json returns string from Pydantic)."""
        model = Model.create(
            {
                "type": "dft",
                "subtype": "gga",
                "method": {"type": "pseudopotential", "subtype": "us"},
            }
        )

        json_data = model.to_dict()
        assert json_data["type"] == "dft"
        assert json_data["subtype"] == "gga"
        assert "method" in json_data
        assert json_data["method"]["type"] == "pseudopotential"

    def test_allowed_types(self):
        """Test allowed_types property."""
        model = Model.create({"type": "dft", "subtype": "gga"})
        allowed = model.allowed_types

        assert len(allowed) > 0
        assert all(hasattr(t, "slug") for t in allowed)

    def test_allowed_subtypes(self):
        """Test allowed_subtypes property."""
        model = Model.create({"type": "dft", "subtype": "gga"})
        allowed = model.allowed_subtypes

        assert len(allowed) > 0
        assert all(hasattr(t, "slug") for t in allowed)


class TestDFTModel:
    """Test DFTModel class."""

    def test_method_returns_method_instance(self):
        """Test that DFTModel.Method returns Method instance."""
        dft_model = DFTModel.create(
            {
                "type": "dft",
                "subtype": "gga",
                "functional": "pbe",
                "method": {"type": "pseudopotential", "subtype": "nc"},
            }
        )

        method_value = dft_model.Method

        # Check that method is an instance, not a plain object
        assert method_value is not None
        assert isinstance(method_value, Method)

        # Check that it has Method class properties and methods
        assert hasattr(method_value, "data")
        assert hasattr(method_value, "search_text")

    def test_functional_property(self):
        """Test functional property."""
        dft_model = DFTModel.create(
            {
                "type": "dft",
                "subtype": "gga",
                "functional": "pbe",
            }
        )

        functional = dft_model.functional
        assert functional is not None

    def test_refiners_property(self):
        """Test refiners property."""
        dft_model = DFTModel.create(
            {
                "type": "dft",
                "subtype": "gga",
                "functional": "pbe",
                "refiners": ["hse"],
            }
        )

        refiners = dft_model.refiners
        assert isinstance(refiners, list)
        assert len(refiners) > 0

    def test_modifiers_property(self):
        """Test modifiers property."""
        dft_model = DFTModel.create(
            {
                "type": "dft",
                "subtype": "gga",
                "functional": "pbe",
                "modifiers": ["soc"],
            }
        )

        modifiers = dft_model.modifiers
        assert isinstance(modifiers, list)
        assert len(modifiers) > 0

    def test_group_slug(self):
        """Test group_slug property."""
        dft_model = DFTModel.create(
            {
                "type": "dft",
                "subtype": "gga",
                "functional": {"slug": "pbe"},
            }
        )

        slug = dft_model.group_slug
        assert isinstance(slug, str)
        assert "dft" in slug
        assert "gga" in slug
        assert "pbe" in slug

    def test_to_json_includes_functional(self):
        """Test that to_dict includes functional (to_json returns string from Pydantic)."""
        dft_model = DFTModel.create(
            {
                "type": "dft",
                "subtype": "gga",
                "functional": {"slug": "pbe"},
            }
        )

        json_data = dft_model.to_dict()
        assert "functional" in json_data
        assert json_data["functional"]["slug"] == "pbe"

    def test_all_functionals(self):
        """Test all_functionals property."""
        dft_model = DFTModel.create(
            {
                "type": "dft",
                "subtype": "gga",
            }
        )

        functionals = dft_model.all_functionals
        assert len(functionals) > 0
        assert all(hasattr(f, "slug") for f in functionals)

    def test_all_refiners(self):
        """Test all_refiners property."""
        dft_model = DFTModel.create(
            {
                "type": "dft",
                "subtype": "gga",
            }
        )

        refiners = dft_model.all_refiners
        assert isinstance(refiners, list)

    def test_all_modifiers(self):
        """Test all_modifiers property."""
        dft_model = DFTModel.create(
            {
                "type": "dft",
                "subtype": "gga",
            }
        )

        modifiers = dft_model.all_modifiers
        assert isinstance(modifiers, list)
