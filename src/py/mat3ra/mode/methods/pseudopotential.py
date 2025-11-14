from typing import Any, Dict, List, Optional, Union

from ..method import Method
from ..types import PseudopotentialLike


class PseudopotentialMethod(Method):
    pseudopotential_cls: Optional[type] = None

    @property
    def pseudo(self) -> List[Dict[str, Any]]:
        return self.data.get("pseudo", [])

    @property
    def all_pseudo(self) -> List[Dict[str, Any]]:
        return self.data.get("allPseudo", [])

    @property
    def pseudopotentials(self) -> List[PseudopotentialLike]:
        if not self.pseudopotential_cls:
            return []
        return [self.pseudopotential_cls(config) for config in self.pseudo]

    @property
    def all_pseudopotentials(self) -> List[PseudopotentialLike]:
        if not self.pseudopotential_cls:
            return []
        return [self.pseudopotential_cls(config) for config in self.all_pseudo]

    @staticmethod
    def extract_exchange_correlation_from_subworkflow(subworkflow: Dict[str, Any]) -> Dict[str, str]:
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
        return any(pseudo.element == element for pseudo in self.pseudopotentials)

    def set_pseudopotential_per_element(self, pseudo: Optional[PseudopotentialLike]) -> None:
        if not pseudo:
            self.set_pseudopotentials([])
            return

        # Filter out existing pseudopotential for the same element
        filtered = [p for p in self.pseudopotentials if p.element != pseudo.element]
        filtered.append(pseudo)
        self.set_pseudopotentials(filtered)

    def add_to_all_pseudos(self, pseudos: Union[PseudopotentialLike, List[PseudopotentialLike]]) -> None:
        if not isinstance(pseudos, list):
            pseudos = [pseudos]

        all_pseudos = self.all_pseudopotentials
        all_pseudos.extend(pseudos)
        self.set_all_pseudopotentials(all_pseudos)

    def set_pseudopotentials(self, pseudopotentials: List[PseudopotentialLike]) -> None:
        # Sort by element and convert to JSON
        sorted_pseudos = sorted(pseudopotentials, key=lambda p: p.element or "")
        data = self.data.copy()
        data["pseudo"] = [p.to_json() for p in sorted_pseudos]
        self.data = data

    def set_all_pseudopotentials(self, pseudopotentials: List[PseudopotentialLike]) -> None:
        # Sort by element and convert to JSON
        sorted_pseudos = sorted(pseudopotentials, key=lambda p: p.element or "")
        data = self.data.copy()
        data["allPseudo"] = [p.to_json() for p in sorted_pseudos]
        self.data = data

    def to_dict(self, exclude: Optional[List[str]] = None) -> Dict[str, Any]:
        json_data = super().to_dict(exclude=exclude)
        
        if exclude is None or "data" not in exclude:
            filtered_data = self.data.copy()
            filtered_data.pop("allPseudo", None)
            json_data["data"] = filtered_data
        
        return json_data
