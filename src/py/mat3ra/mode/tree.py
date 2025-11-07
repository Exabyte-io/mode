"""Tree structures defining allowed model and method types and their relationships."""

from typing import Any, Dict, List, Optional

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry

# TODO: migrate to use manifest instead

METHODS = {
    "pseudopotential": "pseudopotential",
    "localorbital": "localorbital",
    "unknown": "unknown",
}

METHODS_TREE: Dict[str, List[str]] = {
    METHODS["pseudopotential"]: ["paw", "nc", "nc-fr", "us"],
    # TODO: Add additional basis set options, once user choice of specific (i.e 3-21G vs cc-pVDZ) is implemented.
    METHODS["localorbital"]: ["pople"],
    METHODS["unknown"]: ["unknown"],
}


def get_pseudopotential_types_from_tree() -> List[str]:
    """Get all pseudopotential types from the tree."""
    return METHODS_TREE[METHODS["pseudopotential"]]


# DFT-specific
DFT_MODEL_REFINERS = ["hse", "g0w0"]
DFT_MODEL_MODIFIERS = ["soc", "magn"]

DFT_MODEL_TREE = {
    "gga": {
        "refiners": DFT_MODEL_REFINERS,
        "modifiers": DFT_MODEL_MODIFIERS,
        "methods": METHODS_TREE,
        "functionals": ["pbe", "pbesol", "pw91", "other"],
    },
    "lda": {
        "refiners": DFT_MODEL_REFINERS,
        "modifiers": DFT_MODEL_MODIFIERS,
        "methods": METHODS_TREE,
        "functionals": ["pz", "pw", "vwn", "other"],
    },
    "hybrid": {
        "methods": METHODS_TREE,
        "functionals": ["b3lyp", "hse06"],
    },
    "other": {
        "methods": METHODS_TREE,
        "functionals": ["other"],
    },
}

# ML-specific
ML_MODEL_TREE = {
    "re": {
        "methods": {
            "linear": ["least_squares", "ridge"],
            "kernel_ridge": ["rbf", "polynomial"],
        },
    },
}

# Complete model tree
MODEL_TREE = {
    "dft": DFT_MODEL_TREE,
    "ml": ML_MODEL_TREE,
    "unknown": {
        "unknown": {
            "methods": METHODS_TREE,
        },
    },
}

# Model names mapping
MODEL_NAMES = {
    "dft": "Density Functional Theory",
    "ml": "Machine Learning",
    "gga": "Generalized Gradient Approximation",
    "lda": "Local Density Approximation",
    "hybrid": "Hybrid Functional",
    "pbe": "Perdew-Burke-Ernzerhof",
    "pbesol": "PBE for Solids",
    "pw91": "Perdew-Wang 91",
    "pz": "Perdew-Zunger",
    "pw": "Perdew-Wang",
    "vwn": "Vosko-Wilk-Nusair",
    "b3lyp": "B3LYP",
    "hse06": "HSE06",
    "hse": "Heyd-Scuseria-Ernzerhof",
    "g0w0": "G0W0",
    "soc": "Spin-Orbit Coupling",
    "magn": "Magnetic",
    "pseudopotential": "Pseudopotential",
    "paw": "Projector Augmented Wave",
    "nc": "Norm-Conserving",
    "nc-fr": "Norm-Conserving Fully Relativistic",
    "us": "Ultrasoft",
    "localorbital": "Local Orbital",
    "pople": "Pople Basis Set",
    "re": "Regression",
    "linear": "Linear",
    "kernel_ridge": "Kernel Ridge",
    "least_squares": "Least Squares",
    "ridge": "Ridge",
    "rbf": "Radial Basis Function",
    "polynomial": "Polynomial",
    "unknown": "Unknown",
    "other": "Other",
}


def tree_slug_to_named_object(slug: str) -> SlugifiedEntry:
    """Convert a slug to a SlugifiedEntry with name."""
    name = MODEL_NAMES.get(slug, slug)
    return SlugifiedEntry(slug=slug, name=name)


def get_tree_by_application_name_and_version(
    name: str, version: str
) -> Optional[Dict[str, Any]]:
    """Get tree by application name and version.
    
    TODO: Implement this when application-specific trees are needed.
    """
    # Placeholder for future implementation
    return None


def get_default_model_type_for_application(application: Dict[str, Any]) -> Optional[str]:
    """Get default model type for an application.
    
    TODO: Implement this when application-specific defaults are needed.
    """
    # Placeholder for future implementation
    return None
