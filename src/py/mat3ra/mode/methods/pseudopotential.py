"""Pseudopotential method implementation."""

from typing import Any, Dict, List, Optional, Union

from ..method import Method
from ..types import PseudopotentialLike


class PseudopotentialMethod(Method):
    """Pseudopotential method with support for pseudopotential data."""

    def __init__(self, config: Dict[str, Any]):
        """Initialize PseudopotentialMethod."""
        super().__init__(config)
        self.pseudopotential_cls: Optional[type] = None

    @property
    def pseudo(self) -> List[Dict[str, Any]]:
        """Get pseudopotential data."""
        data = self.get_prop("data", {})
        return data.get("pseudo", [])

    @property
    def all_pseudo(self) -> List[Dict[str, Any]]:
        """Get all pseudopotential data."""
        data = self.get_prop("data", {})
        return data.get("allPseudo", [])

    @property
    def pseudopotentials(self) -> List[PseudopotentialLike]:
        """Get pseudopotential objects."""
        if not self.pseudopotential_cls:
            return []
        return [self.pseudopotential_cls(config) for config in self.pseudo]

    @property
    def all_pseudopotentials(self) -> List[PseudopotentialLike]:
        """Get all pseudopotential objects."""
        if not self.pseudopotential_cls:
            return []
        return [self.pseudopotential_cls(config) for config in self.all_pseudo]

    @staticmethod
    def extract_exchange_correlation_from_subworkflow(subworkflow: Dict[str, Any]) -> Dict[str, str]:
        """Extract exchange correlation from subworkflow."""
        model = subworkflow.get("model", {})
        approximation = model.get("subtype", "")
        functional_value = model.get("functional", {})

        if isinstance(functional_value, dict):
            functional = functional_value.get("slug", "")
        else:
            functional = str(functional_value) if functional_value else ""

        return {
            "approximation": approximation,
            "functional": functional,
        }

    def has_pseudopotential_for(self, element: str) -> bool:
        """Check if pseudopotential exists for element."""
        return any(pseudo.element == element for pseudo in self.pseudopotentials)

    def set_pseudopotential_per_element(self, pseudo: Optional[PseudopotentialLike]) -> None:
        """Set pseudopotential for a specific element."""
        if not pseudo:
            self.set_pseudopotentials([])
            return

        # Filter out existing pseudopotential for the same element
        filtered = [p for p in self.pseudopotentials if p.element != pseudo.element]
        filtered.append(pseudo)
        self.set_pseudopotentials(filtered)

    def add_to_all_pseudos(self, pseudos: Union[PseudopotentialLike, List[PseudopotentialLike]]) -> None:
        """Add pseudopotentials to all pseudos list."""
        if not isinstance(pseudos, list):
            pseudos = [pseudos]

        all_pseudos = self.all_pseudopotentials
        all_pseudos.extend(pseudos)
        self.set_all_pseudopotentials(all_pseudos)

    def set_pseudopotentials(self, pseudopotentials: List[PseudopotentialLike]) -> None:
        """Set pseudopotentials."""
        # Sort by element and convert to JSON
        sorted_pseudos = sorted(pseudopotentials, key=lambda p: p.element or "")
        data = self.data.copy()
        data["pseudo"] = [p.to_json() for p in sorted_pseudos]
        self.set_data(data)

    def set_all_pseudopotentials(self, pseudopotentials: List[PseudopotentialLike]) -> None:
        """Set all pseudopotentials."""
        # Sort by element and convert to JSON
        sorted_pseudos = sorted(pseudopotentials, key=lambda p: p.element or "")
        data = self.data.copy()
        data["allPseudo"] = [p.to_json() for p in sorted_pseudos]
        self.set_data(data)

    def to_json_with_clean_data(self, fields_to_exclude: Optional[list] = None) -> Dict[str, Any]:
        """Convert to JSON with clean data, excluding allPseudo by default."""
        if fields_to_exclude is None:
            fields_to_exclude = []

        exclude = fields_to_exclude + ["allPseudo"]
        return super().to_json_with_clean_data(exclude)
