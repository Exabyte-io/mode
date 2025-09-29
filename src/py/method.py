"""Method class implementation."""

from typing import Any, Dict, Optional
import copy


class Method:
    """Method class representing computational methods."""
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize Method with configuration.
        
        Args:
            config: Configuration dictionary containing method data
        """
        data = config.get('data', {})
        self._config = {**config, 'data': data}
        self._data = data
    
    def clone_without_data(self) -> 'Method':
        """Create a clone of the method without data.
        
        Returns:
            Method: Cloned method with empty data
        """
        clone = self.clone()
        clone.set_data({})
        return clone
    
    def clone(self) -> 'Method':
        """Create a deep copy of the method.
        
        Returns:
            Method: Deep copy of the method
        """
        return Method(copy.deepcopy(self._config))
    
    @property
    def type(self) -> str:
        """Get method type.
        
        Returns:
            str: Method type
        """
        return self.prop('type')
    
    @property
    def subtype(self) -> str:
        """Get method subtype.
        
        Returns:
            str: Method subtype
        """
        return self.prop('subtype')
    
    def set_subtype(self, subtype: str) -> None:
        """Set method subtype.
        
        Args:
            subtype: New subtype value
        """
        # TODO: add proper handling of method data subscriptions on type/subtype change
        self.set_prop('subtype', subtype)
    
    @staticmethod
    def get_default_config() -> Dict[str, Any]:
        """Get default configuration.
        
        Returns:
            Dict: Default configuration
        """
        from .default_methods import PSEUDOPOTENTIAL_METHOD_CONFIG
        return PSEUDOPOTENTIAL_METHOD_CONFIG
    
    @property
    def precision(self) -> Any:
        """Get method precision.
        
        Returns:
            Any: Method precision
        """
        return self.prop('precision')
    
    @property
    def data(self) -> Dict[str, Any]:
        """Get method data.
        
        Returns:
            Dict: Method data
        """
        return self.prop('data')
    
    @property
    def search_text(self) -> str:
        """Get search text from data.
        
        Returns:
            str: Search text
        """
        return self.prop('data.searchText', '')
    
    def set_search_text(self, search_text: str) -> None:
        """Set search text in data.
        
        Args:
            search_text: Text to set for searching
        """
        current_data = self.prop('data')
        self.set_data({**current_data, 'searchText': search_text})
    
    def set_data(self, data: Optional[Dict[str, Any]] = None) -> None:
        """Set method data.
        
        Args:
            data: Data dictionary to set
        """
        if data is None:
            data = {}
        self.set_prop('data', data)
        self._data = data
    
    @property
    def omit_in_hash_calculation(self) -> bool:
        """Check if method should be omitted in hash calculation.
        
        Returns:
            bool: True if should be omitted
        """
        data = self.prop('data')
        search_text = data.get('searchText', '')
        filtered_data = {k: v for k, v in data.items() if k != 'searchText'}
        return not search_text and not filtered_data
    
    def clean_data(self, fields_to_exclude: Optional[list] = None) -> Dict[str, Any]:
        """Get data without client-only fields.
        
        Args:
            fields_to_exclude: List of fields to exclude
            
        Returns:
            Dict: Cleaned data
        """
        if fields_to_exclude is None:
            fields_to_exclude = []
        
        filtered_data = dict(self.prop('data'))
        for field in fields_to_exclude:
            filtered_data.pop(field, None)
        return filtered_data
    
    def to_json_with_clean_data(self, fields_to_exclude: Optional[list] = None) -> Dict[str, Any]:
        """Convert to JSON with clean data.
        
        Args:
            fields_to_exclude: List of fields to exclude
            
        Returns:
            Dict: JSON representation with clean data
        """
        if fields_to_exclude is None:
            fields_to_exclude = []
        
        json_data = copy.deepcopy(self._config)
        json_data['data'] = self.clean_data(fields_to_exclude)
        return json_data
    
    def prop(self, path: str, default: Any = None) -> Any:
        """Get property by path.
        
        Args:
            path: Dot-separated path to property
            default: Default value if property not found
            
        Returns:
            Any: Property value or default
        """
        keys = path.split('.')
        value = self._config
        
        try:
            for key in keys:
                value = value[key]
            return value
        except (KeyError, TypeError):
            return default
    
    def set_prop(self, path: str, value: Any) -> None:
        """Set property by path.
        
        Args:
            path: Dot-separated path to property
            value: Value to set
        """
        keys = path.split('.')
        target = self._config
        
        for key in keys[:-1]:
            if key not in target:
                target[key] = {}
            target = target[key]
        
        target[keys[-1]] = value

