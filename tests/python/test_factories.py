"""Tests for factory classes."""

import pytest

from mat3ra.mode import DFTModel, Method, MethodFactory, Model, ModelFactory, PseudopotentialMethod


class TestMethodFactory:
    """Test MethodFactory class."""

    def test_create_basic_method(self):
        """Test creating a basic method."""
        config = {"type": "localorbital", "subtype": "pople"}
        method = MethodFactory.create(config)

        assert isinstance(method, Method)
        assert method.type == "localorbital"

    def test_create_pseudopotential_method(self):
        """Test creating a pseudopotential method."""
        config = {"type": "pseudopotential", "subtype": "us"}
        method = MethodFactory.create(config)

        assert isinstance(method, PseudopotentialMethod)
        assert method.type == "pseudopotential"


class TestModelFactory:
    """Test ModelFactory class."""

    def test_create_basic_model(self):
        """Test creating a basic model."""
        config = {"type": "ml", "subtype": "re"}
        model = ModelFactory.create(config)

        assert isinstance(model, Model)
        assert model.type == "ml"

    def test_create_dft_model(self):
        """Test creating a DFT model."""
        config = {"type": "dft", "subtype": "gga"}
        model = ModelFactory.create(config)

        assert isinstance(model, DFTModel)
        assert model.type == "dft"

    def test_create_from_application_requires_application(self):
        """Test that create_from_application requires application."""
        config = {"type": "dft", "subtype": "gga"}

        with pytest.raises(ValueError, match="application is required"):
            ModelFactory.create_from_application(config)
