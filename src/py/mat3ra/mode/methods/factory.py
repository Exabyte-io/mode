"""Method factory for creating method instances."""

from typing import Any, Dict

from ..method import Method
from .pseudopotential import PseudopotentialMethod


class MethodFactory:
    """Factory for creating method instances."""

    Method = Method
    PseudopotentialMethod = PseudopotentialMethod

    @classmethod
    def create(cls, config: Dict[str, Any]) -> Method:
        """Create a method instance based on configuration.

        Args:
            config: Method configuration dictionary

        Returns:
            Method instance (or specialized subclass)
        """
        method_type = config.get("type", "")

        if method_type == "pseudopotential":
            return cls.PseudopotentialMethod.create(config)

        return cls.Method.create(config)
