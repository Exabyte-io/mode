"""Model factory implementation."""

from typing import Any, Dict
from ..model import Model


class ModelFactory:
    """Factory class for creating model instances."""
    
    @staticmethod
    def create(config: Dict[str, Any]):
        """Create model instance based on configuration.
        
        Args:
            config: Model configuration
            
        Returns:
            Model: Model instance
        """
        model_type = config.get('type')
        
        if model_type == 'dft':
            from .dft import DFTModel
            return DFTModel(config)
        else:
            return Model(**config)
    
    @staticmethod
    def create_from_application(config: Dict[str, Any]):
        """Create model from application configuration.
        
        Args:
            config: Configuration with application info
            
        Returns:
            Model: Model instance
            
        Raises:
            ValueError: If model type cannot be determined
        """
        application = config.get('application')
        if not application:
            raise ValueError("ModelFactory.create_from_application: application is required")
        
        from ..tree import get_default_model_type_for_application
        model_type = get_default_model_type_for_application(application)
        
        if not model_type:
            raise ValueError(f"ModelFactory.create_from_application: cannot determine model type: {model_type}")
        
        return ModelFactory.create({**config, 'type': model_type})

