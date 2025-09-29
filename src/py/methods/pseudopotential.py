"""Pseudopotential method implementation."""

from typing import Any, Dict, List, Optional
from ..method import Method


class PseudopotentialMethod(Method):
    """Pseudopotential method class extending base Method."""
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize PseudopotentialMethod.
        
        Args:
            config: Method configuration
        """
        super().__init__(config)
        self.pseudopotential_cls = None
    
    @property
    def pseudo(self) -> List[Dict[str, Any]]:
        """Get unique/selected pseudopotentials - one per element.
        
        Returns:
            List: List of pseudopotential configurations
        """
        return self.prop('data.pseudo', [])
    
    @property
    def all_pseudo(self) -> List[Dict[str, Any]]:
        """Get all/non-unique pseudopotentials available for choice.
        
        Returns:
            List: List of all pseudopotential configurations
        """
        return self.prop('data.allPseudo', [])
    
    @property
    def pseudopotentials(self) -> List[Any]:
        """Get pseudopotential instances.
        
        Returns:
            List: List of pseudopotential instances
        """
        if not self.pseudopotential_cls:
            return []
        return [self.pseudopotential_cls(x) for x in self.pseudo]
    
    @property
    def all_pseudopotentials(self) -> List[Any]:
        """Get all pseudopotential instances.
        
        Returns:
            List: List of all pseudopotential instances
        """
        if not self.pseudopotential_cls:
            return []
        return [self.pseudopotential_cls(x) for x in self.all_pseudo]
    
    @staticmethod
    def extract_exchange_correlation_from_subworkflow(subworkflow: Dict[str, Any]) -> Dict[str, str]:
        """Extract exchange correlation from subworkflow.
        
        Args:
            subworkflow: Subworkflow configuration
            
        Returns:
            Dict: Exchange correlation information
        """
        model = subworkflow['model']
        approximation = model['subtype']
        functional = model.get('functional', '')
        
        if isinstance(functional, dict):
            functional = functional.get('slug', functional)
        
        return {
            'approximation': approximation,
            'functional': functional,
        }
    
    def has_pseudopotential_for(self, element: str) -> bool:
        """Check if pseudopotential exists for element.
        
        Args:
            element: Chemical element symbol
            
        Returns:
            bool: True if pseudopotential exists for element
        """
        return any(pseudo.element == element for pseudo in self.pseudopotentials)
    
    def set_pseudopotential_per_element(self, pseudo: Optional[Any]) -> None:
        """Set one pseudopotential per element.
        
        Args:
            pseudo: Pseudopotential instance or None
        """
        if not pseudo:
            self.set_pseudopotentials([])
            return
        
        # Filter out existing pseudopotentials for this element
        filtered_pseudos = [p for p in self.pseudopotentials if p.element != pseudo.element]
        filtered_pseudos.append(pseudo)
        self.set_pseudopotentials(filtered_pseudos)
    
    def add_to_all_pseudos(self, pseudos: List[Any]) -> None:
        """Add new pseudopotentials to the list of all pseudopotentials.
        
        Args:
            pseudos: List of pseudopotential instances to add
        """
        if not isinstance(pseudos, list):
            pseudos = [pseudos]
        
        all_pseudos = list(self.all_pseudopotentials)
        all_pseudos.extend(pseudos)
        self.set_all_pseudopotentials(all_pseudos)
    
    def set_pseudopotentials(self, pseudopotentials: List[Any]) -> None:
        """Set pseudopotentials list.
        
        Args:
            pseudopotentials: List of pseudopotential instances
        """
        # Sort by alphabetical order to ensure elements order consistency
        sorted_pseudos = sorted(pseudopotentials, key=lambda x: x.element)
        pseudo_data = [p.to_json() for p in sorted_pseudos]
        
        current_data = self.data
        self.set_data({**current_data, 'pseudo': pseudo_data})
    
    def set_all_pseudopotentials(self, pseudopotentials: List[Any]) -> None:
        """Set all pseudopotentials list.
        
        Args:
            pseudopotentials: List of all pseudopotential instances
        """
        # Sort by alphabetical order to ensure elements order consistency
        sorted_pseudos = sorted(pseudopotentials, key=lambda x: x.element)
        pseudo_data = [p.to_json() for p in sorted_pseudos]
        
        current_data = self.data
        self.set_data({**current_data, 'allPseudo': pseudo_data})
    
    def to_json_with_clean_data(self, exclude: Optional[List[str]] = None) -> Dict[str, Any]:
        """Convert to JSON with clean data.
        
        Override default method to avoid saving 'allPseudo' inside the workflow.
        
        Args:
            exclude: List of fields to exclude
            
        Returns:
            Dict: JSON representation with clean data
        """
        if exclude is None:
            exclude = []
        
        # Add 'allPseudo' to exclusion list
        exclude = list(exclude) + ['allPseudo']
        return super().to_json_with_clean_data(exclude)

