"""Type definitions for mode package."""

from typing import Any, Dict, List, Optional, Protocol, Union

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry
from mat3ra.esse.models.method import BaseMethod
from mat3ra.esse.models.model import BaseModel1


class MethodTreeBranch:
    """Represents a branch in the method tree."""

    def __init__(
        self,
        methods: Optional[Dict[str, List[str]]] = None,
        functionals: Optional[List[str]] = None,
        refiners: Optional[List[str]] = None,
        modifiers: Optional[List[str]] = None,
    ):
        self.methods = methods or {}
        self.functionals = functionals or []
        self.refiners = refiners or []
        self.modifiers = modifiers or []


ModelTree = Dict[str, Dict[str, Any]]

# Config types
ModelConfig = Dict[str, Any]
MethodConfig = Dict[str, Any]


class PseudopotentialLike(Protocol):
    """Protocol for pseudopotential-like objects."""

    element: Optional[str]

    def to_json(self) -> Dict[str, Any]:
        """Convert to JSON representation."""
        ...


# Simplified categorized types for conversion
class SimplifiedCategorizedModel:
    """Simplified categorized model for conversion."""

    def __init__(
        self,
        name: str,
        path: str,
        categories: Dict[str, Any],
        parameters: Dict[str, Any],
    ):
        self.name = name
        self.path = path
        self.categories = categories
        self.parameters = parameters


class SimplifiedCategorizedMethod:
    """Simplified categorized method for conversion."""

    def __init__(
        self,
        name: str,
        path: str,
        units: List[Dict[str, Any]],
    ):
        self.name = name
        self.path = path
        self.units = units
