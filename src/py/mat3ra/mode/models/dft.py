"""DFT model implementation."""

from typing import Any, Dict, List, Union

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry
from pydantic import Field

from ..model import Model
from ..tree import tree_slug_to_named_object
from ..utils import safe_make_array


class DFTModel(Model):
    """DFT-specific model with functional, refiners, and modifiers.
    
    Pydantic model inheriting from Model.
    All fields are automatically initialized via Pydantic.
    """

    functional: Union[SlugifiedEntry, Dict[str, Any], str, None] = None
    refiners: List[Union[SlugifiedEntry, Dict[str, Any], str]] = Field(default_factory=list)
    modifiers: List[Union[SlugifiedEntry, Dict[str, Any], str]] = Field(default_factory=list)

    @property
    def group_slug(self) -> str:
        """Get group slug for DFT model including functional, refiners, and modifiers."""
        functional_slug = self.functional.get("slug", "") if isinstance(self.functional, dict) else str(self.functional)

        refiners = self.refiners
        refiners_slug = "+".join(r.get("slug", "") if isinstance(r, dict) else str(r) for r in refiners)

        modifiers = self.modifiers
        modifiers_slug = "+".join(m.get("slug", "") if isinstance(m, dict) else str(m) for m in modifiers)

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
