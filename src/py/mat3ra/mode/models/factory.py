"""Model factory for creating model instances."""

from typing import Any, Dict

from ..model import Model
from ..tree import get_default_model_type_for_application
from .dft import DFTModel


class ModelFactory:
    """Factory for creating model instances."""

    DFTModel = DFTModel
    Model = Model

    @classmethod
    def create(cls, config: Dict[str, Any]) -> Model:
        """Create a model instance based on configuration.

        Args:
            config: Model configuration dictionary

        Returns:
            Model instance (or specialized subclass)
        """
        model_type = config.get("type", "")

        if model_type == "dft":
            return cls.DFTModel.create(config)

        return cls.Model.create(config)

    @classmethod
    def create_from_application(cls, config: Dict[str, Any]) -> Model:
        """Create a model from application configuration.

        Args:
            config: Model configuration with 'application' key

        Returns:
            Model instance

        Raises:
            ValueError: If application is not provided or model type cannot be determined
        """
        application = config.get("application")
        if not application:
            raise ValueError("ModelFactory.create_from_application: application is required")

        model_type = get_default_model_type_for_application(application)
        if not model_type:
            raise ValueError(f"ModelFactory.create_from_application: cannot determine model type: {model_type}")

        return cls.create({**config, "type": model_type})
