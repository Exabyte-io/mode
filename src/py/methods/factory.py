"""Method factory implementation."""

from typing import Any, Dict
from ..method import Method


class MethodFactory:
    """Factory class for creating method instances."""
    
    @staticmethod
    def create(config: Dict[str, Any]):
        """Create method instance based on configuration.
        
        Args:
            config: Method configuration
            
        Returns:
            Method: Method instance
        """
        method_type = config.get('type')
        
        if method_type == 'pseudopotential':
            from .pseudopotential import PseudopotentialMethod
            return PseudopotentialMethod(config)
        else:
            return Method(config)

