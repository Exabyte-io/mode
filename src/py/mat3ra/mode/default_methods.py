from typing import Any, Dict, List

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry

from .tree import MODEL_NAMES, MODEL_TREE

PseudopotentialMethodConfig: Dict[str, Any] = {
    "type": "pseudopotential",
    "subtype": "us",
}

LocalOrbitalMethodConfig: Dict[str, Any] = {
    "type": "localorbital",
    "subtype": "pople",
}

UnknownMethodConfig: Dict[str, Any] = {
    "type": "unknown",
    "subtype": "unknown",
}


def _map_slug_to_named_object(slug: str) -> SlugifiedEntry:
    name = MODEL_NAMES.get(slug, slug)
    return SlugifiedEntry(slug=slug, name=name)


def allowed_types(model: Dict[str, Any]) -> List[SlugifiedEntry]:
    model_type = model.get("type")
    subtype = model.get("subtype")

    if not model_type or not subtype:
        return []

    branch = MODEL_TREE.get(model_type, {}).get(subtype, {}).get("methods", {})
    return [_map_slug_to_named_object(slug) for slug in branch.keys()]


def allowed_subtypes(model: Dict[str, Any], method_type: str) -> List[SlugifiedEntry]:
    model_type = model.get("type")
    subtype = model.get("subtype")

    if not model_type or not subtype:
        return []

    branch = MODEL_TREE.get(model_type, {}).get(subtype, {}).get("methods", {}).get(method_type, [])
    return [_map_slug_to_named_object(slug) for slug in branch]
