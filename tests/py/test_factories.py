"""Test factory classes."""

import pytest
from src.py.methods.factory import MethodFactory
from src.py.models.factory import ModelFactory
from src.py.method import Method
from src.py.methods.pseudopotential import PseudopotentialMethod
from src.py.model import Model
from src.py.models.dft import DFTModel


class TestMethodFactory:
    """Test cases for MethodFactory."""
    
    def test_create_default_method(self):
        """Test creating default method."""
        config = {'type': 'unknown'}
        method = MethodFactory.create(config)
        assert isinstance(method, Method)
        assert not isinstance(method, PseudopotentialMethod)
    
    def test_create_pseudopotential_method(self):
        """Test creating pseudopotential method."""
        config = {'type': 'pseudopotential', 'subtype': 'us'}
        method = MethodFactory.create(config)
        assert isinstance(method, PseudopotentialMethod)
        assert method.type == 'pseudopotential'


class TestModelFactory:
    """Test cases for ModelFactory."""
    
    def test_create_default_model(self):
        """Test creating default model."""
        config = {'type': 'unknown'}
        model = ModelFactory.create(config)
        assert isinstance(model, Model)
        assert not isinstance(model, DFTModel)
    
    def test_create_dft_model(self):
        """Test creating DFT model."""
        config = {'type': 'dft', 'subtype': 'gga'}
        model = ModelFactory.create(config)
        assert isinstance(model, DFTModel)
        assert model.type == 'dft'
    
    def test_create_from_application_missing_app(self):
        """Test creating from application without application config."""
        config = {}
        with pytest.raises(ValueError, match="application is required"):
            ModelFactory.create_from_application(config)
    
    def test_create_from_application_unknown_app(self):
        """Test creating from application with unknown application."""
        config = {'application': {'name': 'unknown_app', 'version': '1.0'}}
        with pytest.raises(ValueError, match="cannot determine model type"):
            ModelFactory.create_from_application(config)

