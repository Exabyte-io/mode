"""Tree structures defining allowed model and method types and their relationships."""

from typing import Any, Dict, List, Optional

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry
from mat3ra.standata.data.model_tree import MODEL_NAMES, MODEL_TREE
from mat3ra.standata.data.models_tree_config_by_application import (
    models_tree_config_by_application as MODELS_TREE_CONFIG_BY_APPLICATION,
)


def get_pseudopotential_types_from_tree() -> List[str]:
    """Get all pseudopotential types from the tree."""
    methods_tree = MODEL_TREE.get("dft", {}).get("gga", {}).get("methods", {})
    return methods_tree.get("pseudopotential", [])


def tree_slug_to_named_object(slug: str) -> SlugifiedEntry:
    """Convert a slug to a SlugifiedEntry with name."""
    name = MODEL_NAMES.get(slug, slug)
    return SlugifiedEntry(slug=slug, name=name)


def get_tree_by_application_name_and_version(name: str, version: str) -> Dict[str, Any]:
    """Get tree by application name and version.
    
    Mimics TypeScript: getTreeByApplicationNameAndVersion from tree.ts
    """
    # TODO: add logic to filter by version when necessary
    return MODELS_TREE_CONFIG_BY_APPLICATION.get(name, {})


def get_default_model_type_for_application(application: Dict[str, Any]) -> Optional[str]:
    """Get default model type for an application.
    
    Mimics TypeScript: getDefaultModelTypeForApplication from tree.ts
    """
    name = application.get("name")
    if not name:
        return None
    tree = get_tree_by_application_name_and_version(name, application.get("version", ""))
    keys = list(tree.keys())
    return keys[0] if keys else None
