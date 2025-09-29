"""DFT model implementation."""

from typing import Any, Dict, List, Optional
from ..model import Model


class DFTModel(Model):
    """DFT model class extending base Model."""
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize DFTModel.
        
        Args:
            config: Model configuration
        """
        super().__init__(**config)
        
        # Import here to avoid circular imports
        method_factory = config.get('MethodFactory')
        if method_factory:
            from ..methods.factory import MethodFactory
            self._method_factory = method_factory
        else:
            from ..methods.factory import MethodFactory
            self._method_factory = MethodFactory
    
    @property
    def group_slug(self) -> str:
        """Build slug string based on model information.
        
        Returns:
            str: Group slug
        """
        parts = [
            self._application['shortName'],
            self.type,
            self.subtype,
            self.functional['slug'],
            '+'.join(r['slug'] for r in self.refiners),
            '+'.join(m['slug'] for m in self.modifiers),
        ]
        
        # Join with ':' and clean up empty parts
        slug = ':'.join(part for part in parts if part)
        slug = slug.replace('::', ':').rstrip(':')
        return slug
    
    @property
    def default_functional(self) -> Dict[str, str]:
        """Get default functional.
        
        Returns:
            Dict: Default functional with slug and name
        """
        from ..tree import tree_slug_to_named_object
        functionals = self.tree_branch_for_subtype.get('functionals', [])
        if functionals:
            return tree_slug_to_named_object(functionals[0])
        return {'slug': '', 'name': ''}
    
    @property
    def default_refiners(self) -> List[Dict[str, str]]:
        """Get default refiners.
        
        Returns:
            List: Default refiners list
        """
        return []
    
    @property
    def default_modifiers(self) -> List[Dict[str, str]]:
        """Get default modifiers.
        
        Returns:
            List: Default modifiers list
        """
        return []
    
    @property
    def functional(self) -> Dict[str, str]:
        """Get functional.
        
        Returns:
            Dict: Functional configuration
        """
        return self.prop('functional', self.default_functional)
    
    @property
    def refiners(self) -> List[Dict[str, str]]:
        """Get refiners.
        
        Returns:
            List: Refiners list
        """
        return self.prop('refiners', self.default_refiners)
    
    @property
    def modifiers(self) -> List[Dict[str, str]]:
        """Get modifiers.
        
        Returns:
            List: Modifiers list
        """
        return self.prop('modifiers', self.default_modifiers)
    
    def set_subtype(self, subtype: str) -> None:
        """Set model subtype.
        
        Args:
            subtype: New subtype value
        """
        self.set_prop('subtype', subtype)
        self.set_functional(self.default_functional)
    
    def set_functional(self, functional: Dict[str, str]) -> None:
        """Set functional.
        
        Args:
            functional: Functional configuration
        """
        self.set_prop('functional', self._string_to_slugified_object(functional))
        self.set_method(self._method_factory.create(self.default_method_config))
    
    def _set_array_prop(self, name: str, data: List[Any]) -> None:
        """Set array property.
        
        Args:
            name: Property name
            data: Data to set
        """
        if not isinstance(data, list):
            data = [data]
        
        slugified_data = [self._string_to_slugified_object(item) for item in data]
        self.set_prop(name, slugified_data)
        setattr(self, f'_{name}', slugified_data)
    
    def set_refiners(self, refiners: List[Dict[str, str]]) -> None:
        """Set refiners.
        
        Args:
            refiners: Refiners list
        """
        self._set_array_prop('refiners', refiners)
    
    def set_modifiers(self, modifiers: List[Dict[str, str]]) -> None:
        """Set modifiers.
        
        Args:
            modifiers: Modifiers list
        """
        self._set_array_prop('modifiers', modifiers)
    
    def to_json(self) -> Dict[str, Any]:
        """Convert to JSON representation.
        
        Returns:
            Dict: JSON representation
        """
        base_json = super().to_json()
        
        # Only store slug for functional
        functional_slug = {'slug': self.functional['slug']} if self.functional else {}
        
        return {
            **base_json,
            'functional': functional_slug,
            'refiners': self.refiners,
            'modifiers': self.modifiers,
        }
    
    @property
    def all_functionals(self) -> List[Dict[str, str]]:
        """Get all functionals in the form of {name: ..., slug: ...}.
        
        Returns:
            List: List of functional objects
        """
        from ..tree import tree_slug_to_named_object
        functionals = self.tree_branch_for_subtype.get('functionals', [])
        return [tree_slug_to_named_object(x) for x in functionals]
    
    @property
    def all_refiners(self) -> List[Dict[str, str]]:
        """Get all refiners in the form of {name: ..., slug: ...}.
        
        Returns:
            List: List of refiner objects
        """
        from ..tree import tree_slug_to_named_object
        refiners = self.tree_branch_for_subtype.get('refiners', [])
        return [tree_slug_to_named_object(x) for x in refiners]
    
    @property
    def all_modifiers(self) -> List[Dict[str, str]]:
        """Get all modifiers in the form of {name: ..., slug: ...}.
        
        Returns:
            List: List of modifier objects
        """
        from ..tree import tree_slug_to_named_object
        modifiers = self.tree_branch_for_subtype.get('modifiers', [])
        return [tree_slug_to_named_object(x) for x in modifiers]

