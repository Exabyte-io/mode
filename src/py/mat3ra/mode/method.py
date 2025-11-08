"""Method class implementation."""

from typing import Any, Dict, Optional

from mat3ra.code.entity import InMemoryEntityPydantic
from mat3ra.esse.models.method import BaseMethod
from pydantic import Field

from .default_methods import PseudopotentialMethodConfig


class Method(BaseMethod, InMemoryEntityPydantic):
    """Method class representing a computational method.

    Pydantic model with fields inherited from BaseMethod.
    All fields are automatically initialized via Pydantic.
    """

    data: Dict[str, Any] = Field(default_factory=dict)

    def clone_without_data(self) -> "Method":
        """Clone the method without data."""
        cloned = self.clone()
        cloned.data = {}
        return cloned

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        """Get default configuration."""
        return PseudopotentialMethodConfig.copy()

    @property
    def search_text(self) -> str:
        """Get search text from data."""
        return self.data.get("searchText", "")

    @property
    def omit_in_hash_calculation(self) -> bool:
        """Check if method should be omitted in hash calculation."""
        data = self.data
        if not data:
            return True
        # Omit if only searchText is present and empty, or no fields at all
        search_text = data.get("searchText", "")
        other_fields = {k: v for k, v in data.items() if k != "searchText"}
        return not search_text and not other_fields

    def clean_data(self, fields_to_exclude: Optional[list] = None) -> Dict[str, Any]:
        """Clean data by excluding specified fields."""
        if fields_to_exclude is None:
            fields_to_exclude = []

        filtered_data = self.data.copy()
        for field in fields_to_exclude:
            filtered_data.pop(field, None)
        return filtered_data

    def to_json_with_clean_data(self, fields_to_exclude: Optional[list] = None) -> Dict[str, Any]:
        """Convert to JSON with clean data."""
        if fields_to_exclude is None:
            fields_to_exclude = []

        json_data = self.model_dump()
        json_data["data"] = self.clean_data(fields_to_exclude)
        return json_data
