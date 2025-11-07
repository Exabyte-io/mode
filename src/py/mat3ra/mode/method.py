"""Method class implementation."""

import copy
from typing import Any, Dict, Optional

from mat3ra.code.entity import InMemoryEntity
from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry
from mat3ra.esse.models.method import BaseMethod as EsseBaseMethod

from .default_methods import PseudopotentialMethodConfig


class Method(InMemoryEntity):
    """Method class representing a computational method."""

    def __init__(self, config: Dict[str, Any]):
        """Initialize Method.
        
        Args:
            config: Configuration dictionary with at least 'type' and 'subtype'
        """
        data = config.get("data", {})
        config_with_data = {**config, "data": data}
        super().__init__(config_with_data)
        self._json = config_with_data

    @property
    def type(self) -> str:
        """Get the method type."""
        return self.get_prop("type", "")

    @property
    def subtype(self) -> Any:
        """Get the method subtype."""
        return self.get_prop("subtype", "")

    @property
    def data(self) -> Dict[str, Any]:
        """Get the method data."""
        return self.get_prop("data", {})

    @property
    def precision(self) -> Optional[float]:
        """Get the method precision."""
        return self.get_prop("precision")

    def clone_without_data(self) -> "Method":
        """Clone the method without data."""
        cloned = self.clone()
        cloned.set_data({})
        return cloned

    def set_subtype(self, subtype: SlugifiedEntry) -> None:
        """Set the method subtype."""
        self.set_prop("subtype", subtype)

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        """Get default configuration."""
        return PseudopotentialMethodConfig.copy()

    @property
    def search_text(self) -> str:
        """Get search text from data."""
        return self.get_prop("data.searchText", "")

    def set_search_text(self, search_text: str) -> None:
        """Set search text in data."""
        data = self.data.copy()
        data["searchText"] = search_text
        self.set_data(data)

    def set_data(self, data: Optional[Dict[str, Any]] = None) -> None:
        """Set method data."""
        self.set_prop("data", data or {})

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
        
        json_data = copy.deepcopy(self._json)
        json_data["data"] = self.clean_data(fields_to_exclude)
        return json_data

    def to_json(self) -> Dict[str, Any]:
        """Convert to JSON representation."""
        return {
            "type": self.type,
            "subtype": self.subtype,
            "data": self.data,
            "precision": self.precision,
        }
