"""Default method configurations."""

from typing import Any, Dict, List
from .tree import MODEL_NAMES, MODEL_TREE


PSEUDOPOTENTIAL_METHOD_CONFIG = {
    'type': 'pseudopotential',
    'subtype': 'us',
}

LOCAL_ORBITAL_METHOD_CONFIG = {
    'type': 'localorbital',
    'subtype': 'pople',
}

UNKNOWN_METHOD_CONFIG = {
    'type': 'unknown',
    'subtype': 'unknown',
}


def allowed_types(model: Dict[str, Any]) -> List[Dict[str, str]]:
    """Get allowed method types for a model.
    
    Args:
        model: Model configuration
        
    Returns:
        List: List of allowed types with slug and name
    """
    model_type = model.get('type', '')
    model_subtype = model.get('subtype', '')
    
    methods_path = f"{model_type}.{model_subtype}.methods"
    methods_dict = _get_nested_value(MODEL_TREE, methods_path, {})
    
    return [
        {
            'slug': method_type,
            'name': MODEL_NAMES.get(method_type, method_type),
        }
        for method_type in methods_dict.keys()
    ]


def allowed_subtypes(model: Dict[str, Any], method_type: str) -> List[Dict[str, str]]:
    """Get allowed method subtypes for a model and method type.
    
    Args:
        model: Model configuration
        method_type: Method type
        
    Returns:
        List: List of allowed subtypes with slug and name
    """
    model_type = model.get('type', '')
    model_subtype = model.get('subtype', '')
    
    subtypes_path = f"{model_type}.{model_subtype}.methods.{method_type}"
    subtypes_list = _get_nested_value(MODEL_TREE, subtypes_path, [])
    
    return [
        {
            'slug': subtype,
            'name': MODEL_NAMES.get(subtype, subtype),
        }
        for subtype in subtypes_list
    ]


def _get_nested_value(obj: Dict[str, Any], path: str, default: Any = None) -> Any:
    """Get nested value from dictionary using dot notation.
    
    Args:
        obj: Dictionary to traverse
        path: Dot-separated path
        default: Default value if path not found
        
    Returns:
        Any: Value at path or default
    """
    keys = path.split('.')
    current = obj
    
    try:
        for key in keys:
            current = current[key]
        return current
    except (KeyError, TypeError):
        return default

