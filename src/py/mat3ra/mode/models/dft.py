"""DFT model implementation."""

from typing import Any, Dict, List, Union

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry

from ..methods.factory import MethodFactory
from ..model import Model
from ..tree import tree_slug_to_named_object
from ..utils import safe_make_array


class DFTModel(Model):
    """DFT-specific model with functional, refiners, and modifiers."""

    def __init__(self, config: Dict[str, Any]):
        """Initialize DFTModel."""
        method_factory = config.pop("MethodFactory", None)
        super().__init__(config)
        if method_factory:
            self._method_factory = method_factory

    @property
    def group_slug(self) -> str:
        """Get group slug for DFT model including functional, refiners, and modifiers."""
        functional_slug = self.functional.get("slug", "") if isinstance(self.functional, dict) else str(self.functional)
        
        refiners = self.refiners
        refiners_slug = "+".join(
            r.get("slug", "") if isinstance(r, dict) else str(r) for r in refiners
        )
        
        modifiers = self.modifiers
        modifiers_slug = "+".join(
            m.get("slug", "") if isinstance(m, dict) else str(m) for m in modifiers
        )
        
        slugs = []
        if self._application:
            slugs.append(self._application.get("shortName", ""))
        slugs.extend([self.type, self.subtype, functional_slug, refiners_slug, modifiers_slug])
        
        # Filter out empty strings
        slugs = [s for s in slugs if s]
        return ":".join(slugs)

    @property
    def default_functional(self) -> SlugifiedEntry:
        """Get default functional."""
        functionals = self.tree_branch_for_subtype.functionals
        if not functionals:
            return tree_slug_to_named_object("pbe")
        return tree_slug_to_named_object(functionals[0])

    @property
    def default_refiners(self) -> List[SlugifiedEntry]:
        """Get default refiners."""
        return []

    @property
    def default_modifiers(self) -> List[SlugifiedEntry]:
        """Get default modifiers."""
        return []

    @property
    def functional(self) -> Union[SlugifiedEntry, Dict[str, Any]]:
        """Get functional."""
        return self.get_prop("functional", self.default_functional)

    @property
    def refiners(self) -> List[Union[SlugifiedEntry, Dict[str, Any]]]:
        """Get refiners."""
        return self.get_prop("refiners", self.default_refiners)

    @property
    def modifiers(self) -> List[Union[SlugifiedEntry, Dict[str, Any]]]:
        """Get modifiers."""
        return self.get_prop("modifiers", self.default_modifiers)

    def set_subtype(self, subtype: Union[str, SlugifiedEntry]) -> None:
        """Set subtype and update functional."""
        self.set_prop("subtype", subtype)
        self.set_functional(self.default_functional)

    def set_functional(self, functional: Union[str, SlugifiedEntry]) -> None:
        """Set functional."""
        self.set_prop("functional", self._string_to_slugified_object(functional))
        self.set_method(self._method_factory.create(self.default_method_config))

    def _set_array_prop(
        self, name: str, data: Union[Any, List[Any]]
    ) -> None:
        """Set array property (refiners or modifiers)."""
        normalized = [
            self._string_to_slugified_object(item)
            for item in safe_make_array(data)
        ]
        self.set_prop(name, normalized)

    def set_refiners(self, refiners: Union[Any, List[Any]]) -> None:
        """Set refiners."""
        self._set_array_prop("refiners", refiners)

    def set_modifiers(self, modifiers: Union[Any, List[Any]]) -> None:
        """Set modifiers."""
        self._set_array_prop("modifiers", modifiers)

    def to_json(self) -> Dict[str, Any]:
        """Convert to JSON representation."""
        json_data = super().to_json()
        
        def pick_slug(item: Union[SlugifiedEntry, Dict[str, Any]]) -> Dict[str, str]:
            if isinstance(item, dict):
                return {"slug": item.get("slug", "")}
            return {"slug": getattr(item, "slug", "")}
        
        functional = self.functional
        json_data["functional"] = pick_slug(functional) if functional else {"slug": ""}
        json_data["refiners"] = self.refiners
        json_data["modifiers"] = self.modifiers
        
        return json_data

    @property
    def all_functionals(self) -> List[SlugifiedEntry]:
        """Get all available functionals."""
        functionals = self.tree_branch_for_subtype.functionals
        return [tree_slug_to_named_object(slug) for slug in functionals]

    @property
    def all_refiners(self) -> List[SlugifiedEntry]:
        """Get all available refiners."""
        refiners = self.tree_branch_for_subtype.refiners
        return [tree_slug_to_named_object(slug) for slug in refiners]

    @property
    def all_modifiers(self) -> List[SlugifiedEntry]:
        """Get all available modifiers."""
        modifiers = self.tree_branch_for_subtype.modifiers
        return [tree_slug_to_named_object(slug) for slug in modifiers]
