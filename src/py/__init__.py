"""MOdel and method DEfinitions - Python version."""

from .data.method_list import all_methods as categorized_method_list
from .data.model_list import all_models as categorized_model_list
from .default_methods import (
    PSEUDOPOTENTIAL_METHOD_CONFIG,
    LOCAL_ORBITAL_METHOD_CONFIG,
    UNKNOWN_METHOD_CONFIG,
    allowed_types,
    allowed_subtypes,
)
from .default_models import DFT_MODEL_CONFIG, UNKNOWN_MODEL_CONFIG
from .method import Method
from .methods.factory import MethodFactory
from .methods.pseudopotential import PseudopotentialMethod
from .model import Model
from .models.dft import DFTModel
from .models.factory import ModelFactory
from . import tree

# Export default configs with original names for compatibility
default_methods = {
    'PseudopotentialMethodConfig': PSEUDOPOTENTIAL_METHOD_CONFIG,
    'LocalOrbitalMethodConfig': LOCAL_ORBITAL_METHOD_CONFIG,
    'UnknownMethodConfig': UNKNOWN_METHOD_CONFIG,
    'allowedTypes': allowed_types,
    'allowedSubtypes': allowed_subtypes,
}

default_models = {
    'DFTModelConfig': DFT_MODEL_CONFIG,
    'UnknownModelConfig': UNKNOWN_MODEL_CONFIG,
}

__all__ = [
    'Method',
    'Model', 
    'MethodFactory',
    'ModelFactory',
    'PseudopotentialMethod',
    'DFTModel',
    'tree',
    'default_models',
    'default_methods',
    'categorized_model_list',
    'categorized_method_list',
]
