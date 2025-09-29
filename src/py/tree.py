"""Tree module for model and method hierarchies."""

from typing import Any, Dict, List, Optional
import copy


# Method constants
METHODS = {
    'pseudopotential': 'pseudopotential',
    'localorbital': 'localorbital',
    'unknown': 'unknown',
}

methods = {
    METHODS['pseudopotential']: ['paw', 'nc', 'nc-fr', 'us'],
    # TODO: Add additional basis set options, once user choice of specific (i.e 3-21G vs cc-pVDZ) is implemented.
    METHODS['localorbital']: ['pople'],
    METHODS['unknown']: ['unknown'],
}


def get_pseudopotential_types_from_tree() -> List[str]:
    """Get pseudopotential types from tree.
    
    Returns:
        List: List of pseudopotential types
    """
    return methods[METHODS['pseudopotential']]


# DFT-specific constants
DFT_MODEL_REFINERS = ['hse', 'g0w0']
DFT_MODEL_MODIFIERS = ['soc', 'magn']

DFT_MODEL_TREE = {
    'gga': {
        'refiners': DFT_MODEL_REFINERS,
        'modifiers': DFT_MODEL_MODIFIERS,
        'methods': methods,
        'functionals': ['pbe', 'pbesol', 'pw91', 'other'],
    },
    'lda': {
        'refiners': DFT_MODEL_REFINERS,
        'modifiers': DFT_MODEL_MODIFIERS,
        'methods': methods,
        'functionals': ['pz', 'pw', 'vwn', 'other'],
    },
    'hybrid': {
        'methods': methods,
        'functionals': ['b3lyp', 'hse06'],
    },
    'other': {
        'methods': methods,
        'functionals': ['other'],
    },
}


def get_dft_functionals_from_tree() -> List[str]:
    """Get DFT functionals from tree.
    
    Returns:
        List: List of DFT functional keys
    """
    return list(DFT_MODEL_TREE.keys())


def get_dft_functionals_by_approximation(approximation: str) -> Optional[List[str]]:
    """Get DFT functionals by approximation.
    
    Args:
        approximation: DFT approximation type
        
    Returns:
        List: List of functionals for the approximation, or None if not found
    """
    branch = DFT_MODEL_TREE.get(approximation)
    return branch.get('functionals') if branch else None


# General model tree
MODEL_TREE = {
    'dft': DFT_MODEL_TREE,
    'ml': {
        're': {
            'methods': {
                'linear': ['least_squares', 'ridge'],
                'kernel_ridge': ['least_squares'],
            },
        },
    },
    'unknown': {
        'unknown': {
            'methods': {
                'unknown': ['unknown'],
            },
        },
    },
}

MODEL_NAMES = {
    'dft': 'density functional theory',
    'lda': 'local density approximation',
    'gga': 'generalized gradient approximation',
    'hybrid': 'hybrid functional',
    'ml': 'machine learning',
    're': 'regression',
}


def tree_slug_to_named_object(model_slug: str) -> Dict[str, str]:
    """Convert tree slug to named object.
    
    Args:
        model_slug: Model slug string
        
    Returns:
        Dict: Object with slug and name
    """
    return {
        'slug': model_slug,
        'name': MODEL_NAMES.get(model_slug, model_slug),
    }


# Application-specific model trees
def _create_application_trees():
    """Create application-specific model trees."""
    vasp_models_tree = copy.deepcopy({k: v for k, v in MODEL_TREE.items() if k == 'dft'})
    espresso_models_tree = copy.deepcopy({k: v for k, v in MODEL_TREE.items() if k == 'dft'})
    nwchem_models_tree = copy.deepcopy({k: v for k, v in MODEL_TREE.items() if k == 'dft'})
    
    # Modify trees for specific applications
    for approximation in ['gga', 'lda']:
        # Pick "paw" for VASP (first element)
        if 'dft' in vasp_models_tree and approximation in vasp_models_tree['dft']:
            psp_methods = vasp_models_tree['dft'][approximation]['methods']['pseudopotential']
            vasp_models_tree['dft'][approximation]['methods']['pseudopotential'] = psp_methods[:1]
        
        # Assert "us" is the first option for Espresso (reverse order)
        if 'dft' in espresso_models_tree and approximation in espresso_models_tree['dft']:
            psp_methods = espresso_models_tree['dft'][approximation]['methods']['pseudopotential']
            espresso_models_tree['dft'][approximation]['methods']['pseudopotential'] = list(reversed(psp_methods))
    
    unknown_models_tree = {k: v for k, v in MODEL_TREE.items() if k == 'unknown'}
    
    return {
        'vasp_models_tree': vasp_models_tree,
        'espresso_models_tree': espresso_models_tree,
        'nwchem_models_tree': nwchem_models_tree,
        'unknown_models_tree': unknown_models_tree,
    }


_APP_TREES = _create_application_trees()

MODELS_TREE_CONFIGS_BY_APPLICATION_NAME_VERSION = [
    {
        'name': 'vasp',
        'tree': _APP_TREES['vasp_models_tree'],
    },
    {
        'name': 'espresso',
        'tree': _APP_TREES['espresso_models_tree'],
    },
    {
        'name': 'python',
        'tree': _APP_TREES['unknown_models_tree'],
    },
    {
        'name': 'shell',
        'tree': _APP_TREES['unknown_models_tree'],
    },
    {
        'name': 'jupyterLab',
        'tree': _APP_TREES['unknown_models_tree'],
    },
    {
        'name': 'nwchem',
        'tree': _APP_TREES['nwchem_models_tree'],
    },
    {
        'name': 'deepmd',
        'tree': _APP_TREES['unknown_models_tree'],
    },
]


def get_tree_by_application_name_and_version(app_config: Dict[str, str]) -> Dict[str, Any]:
    """Get tree by application name and version.
    
    Args:
        app_config: Dictionary with 'name' and 'version' keys
        
    Returns:
        Dict: Application-specific tree
    """
    name = app_config['name']
    # TODO: add logic to filter by version when necessary
    
    matching_configs = [
        cfg for cfg in MODELS_TREE_CONFIGS_BY_APPLICATION_NAME_VERSION
        if cfg['name'] == name
    ]
    
    trees = [cfg['tree'] for cfg in matching_configs]
    
    # Merge all matching trees
    result = {}
    for tree in trees:
        result.update(tree)
    
    return result


def get_default_model_type_for_application(application: Dict[str, str]) -> Optional[str]:
    """Get default model type for application.
    
    Args:
        application: Application configuration
        
    Returns:
        str: Default model type, or None if not found
    """
    tree = get_tree_by_application_name_and_version(application)
    return list(tree.keys())[0] if tree else None


def _safely_get(obj: Dict[str, Any], *keys) -> Any:
    """Safely get nested dictionary value.
    
    Args:
        obj: Dictionary to traverse
        *keys: Keys to traverse
        
    Returns:
        Any: Value at path, or None if not found
    """
    try:
        for key in keys:
            obj = obj[key]
        return obj
    except (KeyError, TypeError):
        return None


def _merge_terminal_nodes(tree: Any) -> List[Any]:
    """Merge terminal nodes from tree structure.
    
    Args:
        tree: Tree structure to process
        
    Returns:
        List: Flattened list of terminal nodes
    """
    if tree is None:
        return []
    
    if isinstance(tree, list):
        return tree
    
    if isinstance(tree, dict):
        result = []
        for value in tree.values():
            result.extend(_merge_terminal_nodes(value))
        return result
    
    return [tree]


def get_method_filter_objects(
    filter_tree: Dict[str, Any],
    tier1: Optional[str] = None,
    tier2: Optional[str] = None,
    tier3: Optional[str] = None,
    method_type: Optional[str] = None,
    subtype: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Create list of filter objects based on model categories.
    
    Args:
        filter_tree: Filter tree constructed from assets
        tier1: Level 1 tier
        tier2: Level 2 tier
        tier3: Level 3 tier
        method_type: Method type
        subtype: Method subtype
        
    Returns:
        List: List of filter objects
    """
    if not tier1:
        filter_list = _merge_terminal_nodes(filter_tree)
    elif not tier2:
        filter_list = _merge_terminal_nodes(_safely_get(filter_tree, tier1))
    elif not tier3:
        filter_list = _merge_terminal_nodes(_safely_get(filter_tree, tier1, tier2))
    elif not method_type:
        filter_list = _merge_terminal_nodes(_safely_get(filter_tree, tier1, tier2, tier3))
    elif not subtype:
        filter_list = _merge_terminal_nodes(_safely_get(filter_tree, tier1, tier2, tier3, method_type))
    else:
        filter_list = _safely_get(filter_tree, tier1, tier2, tier3, method_type, subtype)
    
    if not filter_list:
        return []
    
    def extract_unique_by(name: str) -> List[Dict[str, Any]]:
        """Extract unique items by field name."""
        seen = set()
        result = []
        for item in filter_list:
            if item and isinstance(item, dict) and item.get(name):
                if item[name] not in seen:
                    seen.add(item[name])
                    result.append(item)
        return result
    
    path_filters = extract_unique_by('path')
    regex_filters = extract_unique_by('regex')
    
    return path_filters + regex_filters


def filter_methods_by_model(method_list: List[Dict[str, Any]], model: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Filter list of method configs based on model.
    
    Args:
        method_list: Array of method configs
        model: Model config for which methods should be filtered
        
    Returns:
        List: Filtered method list
    """
    if not model:
        return []
    
    categories = model.get('categories', {})
    
    # Import here to avoid circular imports
    from .data.model_method_map import model_method_map
    
    filter_objects = get_method_filter_objects(
        filter_tree=model_method_map,
        tier1=categories.get('tier1'),
        tier2=categories.get('tier2'),
        tier3=categories.get('tier3'),
        method_type=categories.get('type'),
        subtype=categories.get('subtype')
    )
    
    # Simple filtering implementation
    # This would need to be enhanced based on the actual filtering logic from @mat3ra/code
    filtered_methods = []
    for method in method_list:
        # Basic path matching - this is a simplified version
        method_path = method.get('path', '')
        for filter_obj in filter_objects:
            if 'path' in filter_obj and filter_obj['path'] in method_path:
                filtered_methods.append(method)
                break
            elif 'regex' in filter_obj:
                # Simple regex matching - would need proper regex implementation
                import re
                if re.search(filter_obj['regex'], method_path):
                    filtered_methods.append(method)
                    break
    
    return filtered_methods

