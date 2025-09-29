"""Test Model class."""

import pytest
from src.py.model import Model


class TestModel:
    """Test cases for Model class."""
    
    def test_can_be_created(self):
        """Test that Model can be created."""
        obj = {'type': 'dft'}
        model = Model(**obj)
        assert model.type == 'dft'
    
    def test_default_type(self):
        """Test default type property."""
        model = Model()
        # Should have a default type from the tree
        assert model.default_type is not None
    
    def test_default_subtype(self):
        """Test default subtype property."""
        model = Model()
        # Should have a default subtype from the tree
        assert model.default_subtype is not None
    
    def test_set_subtype(self):
        """Test setting subtype."""
        model = Model(type='dft')
        model.set_subtype('lda')
        assert model.subtype == 'lda'
    
    def test_to_json(self):
        """Test JSON serialization."""
        model = Model(type='dft', subtype='gga')
        json_data = model.to_json()
        
        assert json_data['type'] == 'dft'
        assert json_data['subtype'] == 'gga'
        assert 'method' in json_data
    
    def test_is_unknown(self):
        """Test is_unknown property."""
        model = Model(type='unknown')
        assert model.is_unknown is True
        
        model = Model(type='dft')
        assert model.is_unknown is False

