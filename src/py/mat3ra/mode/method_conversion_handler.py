"""Method conversion handler for converting between simple and categorized methods."""

from typing import Any, Dict, List, Optional, Union

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry

from .default_methods import LocalOrbitalMethodConfig, UnknownMethodConfig
from .types import SimplifiedCategorizedMethod


def safely_get_slug(slug_obj: Union[str, SlugifiedEntry, Dict[str, Any]]) -> str:
    """Safely extract slug from various input types."""
    if isinstance(slug_obj, str):
        return slug_obj
    if isinstance(slug_obj, dict):
        return slug_obj.get("slug", "")
    return getattr(slug_obj, "slug", "")


class MethodConversionHandler:
    """Handler for converting methods between simple and categorized formats."""

    @classmethod
    def convert_to_simple(cls, categorized_method: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Convert categorized method to simple format.
        
        Args:
            categorized_method: Categorized method dictionary
            
        Returns:
            Simple method configuration
        """
        if not categorized_method:
            return cls.convert_unknown_to_simple()
        
        units = categorized_method.get("units", [])
        
        # Check for pseudopotential units
        psp_units = [
            unit for unit in units
            if unit.get("categories", {}).get("type") == "psp"
        ]
        
        # Check for atomic orbital unit
        ao_unit = next(
            (unit for unit in units if unit.get("categories", {}).get("type") == "ao"),
            None
        )
        
        # Check for regression unit
        regression_unit = next(
            (unit for unit in units if "regression" in unit.get("name", "")),
            None
        )
        
        if psp_units:
            return cls.convert_psp_units_to_simple(psp_units)
        elif ao_unit:
            return cls.convert_ao_unit_to_simple()
        elif regression_unit:
            return cls.convert_regression_unit_to_simple(regression_unit)
        else:
            return cls.convert_unknown_to_simple()

    @classmethod
    def convert_unknown_to_simple(cls) -> Dict[str, Any]:
        """Convert unknown method to simple format."""
        return UnknownMethodConfig.copy()

    @classmethod
    def convert_psp_units_to_simple(cls, units: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Convert pseudopotential units to simple format."""
        if not units:
            return cls.convert_unknown_to_simple()
        
        first_unit = units[0]
        categories = first_unit.get("categories", {})
        subtype_obj = categories.get("subtype")
        
        if not subtype_obj:
            return cls.convert_unknown_to_simple()
        
        # If multiple units, use "any" as subtype
        subtype = "any" if len(units) > 1 else safely_get_slug(subtype_obj)
        
        return {
            "type": "pseudopotential",
            "subtype": subtype,
        }

    @classmethod
    def convert_ao_unit_to_simple(cls) -> Dict[str, Any]:
        """Convert atomic orbital unit to simple format."""
        return LocalOrbitalMethodConfig.copy()

    @classmethod
    def convert_regression_unit_to_simple(cls, unit: Dict[str, Any]) -> Dict[str, Any]:
        """Convert regression unit to simple format."""
        categories = unit.get("categories", {})
        type_obj = categories.get("type", "linear")
        subtype_obj = categories.get("subtype", "least_squares")
        
        return {
            "type": safely_get_slug(type_obj),
            "subtype": safely_get_slug(subtype_obj),
            "precision": unit.get("precision"),
        }

    @classmethod
    def convert_to_categorized(
        cls,
        simple_method: Optional[Dict[str, Any]],
        all_methods: Optional[List[Dict[str, Any]]] = None,
    ) -> Optional[SimplifiedCategorizedMethod]:
        """Convert simple method to categorized format.
        
        Args:
            simple_method: Simple method configuration
            all_methods: List of all available categorized methods
            
        Returns:
            SimplifiedCategorizedMethod or None
        """
        if all_methods is None:
            all_methods = []
        
        if not simple_method:
            return None
        
        method_type = simple_method.get("type")
        
        if method_type == "pseudopotential":
            return cls.convert_psp_to_categorized(simple_method, all_methods)
        elif method_type == "localorbital":
            return cls.convert_ao_to_categorized(simple_method)
        elif method_type in ["linear", "kernel_ridge"]:
            return cls.convert_regression_to_categorized(simple_method)
        else:
            return None

    @classmethod
    def convert_psp_to_categorized(
        cls,
        simple_method: Dict[str, Any],
        all_methods: Optional[List[Dict[str, Any]]] = None,
    ) -> Optional[SimplifiedCategorizedMethod]:
        """Convert simple pseudopotential method to categorized format."""
        if all_methods is None:
            all_methods = []
        
        subtype = safely_get_slug(simple_method.get("subtype", "us"))
        
        # The "any" subtype represents all planewave-pseudopotential methods
        all_path = (
            "/qm/wf/none/psp/us::/qm/wf/none/psp/nc::/qm/wf/none/psp/nc-fr::"
            "/qm/wf/none/psp/paw::/qm/wf/none/pw/none"
        )
        
        if subtype == "any":
            path = all_path
        else:
            path = (
                f"/qm/wf/none/smearing/gaussian::/linalg/diag/none/davidson/none::"
                f"/qm/wf/none/psp/{subtype}::/qm/wf/none/pw/none"
            )
        
        # Find matching method in all_methods
        for categorized in all_methods:
            if categorized.get("path") == path:
                return SimplifiedCategorizedMethod(
                    name=categorized.get("name", ""),
                    path=categorized.get("path", ""),
                    units=categorized.get("units", []),
                )
        
        return None

    @classmethod
    def convert_ao_to_categorized(cls, simple_method: Dict[str, Any]) -> SimplifiedCategorizedMethod:
        """Convert simple atomic orbital method to categorized format."""
        subtype = safely_get_slug(simple_method.get("subtype", "pople"))
        
        unit = {
            "parameters": {
                "basisSlug": "6-31G",
            },
            "categories": {
                "tier1": "qm",
                "tier2": "wf",
                "type": "ao",
                "subtype": subtype,
            },
            "tags": ["atomic orbital"],
            "name": "Wave function: LCAO - Pople basis set (6-31G)",
            "path": "/qm/wf/none/ao/pople?basisSlug=6-31G",
        }
        
        return SimplifiedCategorizedMethod(
            units=[unit],
            name="Wave function: LCAO - Pople basis set (6-31G)",
            path="/qm/wf/none/ao/pople?basisSlug=6-31G",
        )

    @classmethod
    def convert_regression_to_categorized(
        cls, simple_method: Dict[str, Any]
    ) -> SimplifiedCategorizedMethod:
        """Convert simple regression method to categorized format."""
        method_type = safely_get_slug(simple_method.get("type", "linear"))
        subtype = safely_get_slug(simple_method.get("subtype", "least_squares"))
        precision = simple_method.get("precision")
        
        path = f"/none/none/none/{method_type}/{subtype}"
        
        name_map = {
            "kernel_ridge": "Kernel ridge",
            "linear": "Linear",
            "least_squares": "least squares",
            "ridge": "ridge",
        }
        
        type_name = name_map.get(method_type, method_type)
        subtype_name = name_map.get(subtype, subtype)
        name = f"{type_name} {subtype_name} regression"
        
        unit = {
            "categories": {
                "type": method_type,
                "subtype": subtype,
            },
            "name": name,
            "path": path,
            "precision": precision,
        }
        
        return SimplifiedCategorizedMethod(
            units=[unit],
            name=name,
            path=path,
        )
