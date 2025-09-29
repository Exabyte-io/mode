"""Test Method class."""

import pytest
from src.py.method import Method


class TestMethod:
    """Test cases for Method class."""
    
    def test_can_be_created(self):
        """Test that Method can be created."""
        config = {'type': 'pseudopotential', 'subtype': 'us'}
        method = Method(config)
        assert method.type == 'pseudopotential'
        assert method.subtype == 'us'
    
    def test_clone_without_data(self):
        """Test cloning without data."""
        config = {'type': 'pseudopotential', 'data': {'test': 'value'}}
        method = Method(config)
        clone = method.clone_without_data()
        
        assert clone.type == method.type
        assert clone.data == {}
    
    def test_set_search_text(self):
        """Test setting search text."""
        method = Method({})
        method.set_search_text('test search')
        assert method.search_text == 'test search'
    
    def test_clean_data(self):
        """Test cleaning data."""
        config = {
            'type': 'pseudopotential',
            'data': {
                'searchText': 'test',
                'important': 'value',
                'exclude_me': 'should be removed'
            }
        }
        method = Method(config)
        cleaned = method.clean_data(['exclude_me'])
        
        assert 'exclude_me' not in cleaned
        assert cleaned['important'] == 'value'
        assert cleaned['searchText'] == 'test'
    
    def test_omit_in_hash_calculation(self):
        """Test omit in hash calculation property."""
        # Empty data should be omitted
        method = Method({'type': 'test'})
        assert method.omit_in_hash_calculation is True
        
        # Data with only searchText should be omitted
        method.set_search_text('test')
        assert method.omit_in_hash_calculation is True
        
        # Data with other fields should not be omitted
        method.set_data({'searchText': 'test', 'other': 'value'})
        assert method.omit_in_hash_calculation is False

