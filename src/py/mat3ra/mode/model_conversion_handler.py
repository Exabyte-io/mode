"""Model conversion handler for converting between simple and categorized models."""

from typing import Any, Dict, List, Optional, Union

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry

from . import tree
from .types import ModelConfig, SimplifiedCategorizedModel


def safely_get_slug(slug_obj: Union[str, SlugifiedEntry, Dict[str, Any]]) -> str:
    """Safely extract slug from various input types."""
    if isinstance(slug_obj, str):
        return slug_obj
    if isinstance(slug_obj, dict):
        return slug_obj.get("slug", "")
    return getattr(slug_obj, "slug", "")


class ModelConversionHandler:
    """Handler for converting models between simple and categorized formats."""

    @classmethod
    def convert_to_simple(cls, categorized_model: Optional[Dict[str, Any]]) -> ModelConfig:
        """Convert categorized model to simple format.
        
        Args:
            categorized_model: Categorized model dictionary
            
        Returns:
            Simple model configuration
        """
        if not categorized_model:
            return cls.convert_unknown_to_simple()
        
        categories = categorized_model.get("categories", {})
        tier3 = categories.get("tier3", "")
        
        if tier3 == "dft":
            return cls.convert_dft_to_simple(categorized_model)
        elif tier3 == "ml":
            return cls.convert_ml_to_simple()
        else:
            return cls.convert_unknown_to_simple()

    @classmethod
    def convert_dft_to_simple(cls, categorized_model: Dict[str, Any]) -> ModelConfig:
        """Convert DFT categorized model to simple format."""
        categories = categorized_model.get("categories", {})
        subtype_category = categories.get("subtype")
        
        if not subtype_category:
            return cls.convert_unknown_to_simple()
        
        subtype = safely_get_slug(subtype_category)
        
        parameters = categorized_model.get("parameters", {})
        functional_param = parameters.get("functional")
        functional_slug = safely_get_slug(functional_param) if functional_param else ""
        
        return {
            "type": "dft",
            "subtype": subtype,
            "functional": tree.tree_slug_to_named_object(functional_slug),
        }

    @classmethod
    def convert_ml_to_simple(cls) -> ModelConfig:
        """Convert ML categorized model to simple format."""
        return {
            "type": "ml",
            "subtype": "re",
        }

    @classmethod
    def convert_unknown_to_simple(cls) -> ModelConfig:
        """Convert unknown model to simple format."""
        return {
            "type": "unknown",
            "subtype": "unknown",
        }

    @classmethod
    def convert_to_categorized(
        cls,
        simple_model: Optional[ModelConfig],
        all_models: Optional[List[Dict[str, Any]]] = None,
    ) -> Optional[SimplifiedCategorizedModel]:
        """Convert simple model to categorized format.
        
        Args:
            simple_model: Simple model configuration
            all_models: List of all available categorized models
            
        Returns:
            SimplifiedCategorizedModel or None
        """
        if all_models is None:
            all_models = []
        
        if not simple_model:
            return None
        
        model_type = simple_model.get("type")
        
        if model_type == "dft":
            return cls.convert_dft_to_categorized(simple_model, all_models)
        elif model_type == "ml":
            return cls.convert_ml_to_categorized(simple_model)
        elif model_type == "unknown":
            return None
        else:
            return None

    @classmethod
    def convert_dft_to_categorized(
        cls,
        simple_model: ModelConfig,
        all_models: Optional[List[Dict[str, Any]]] = None,
    ) -> Optional[SimplifiedCategorizedModel]:
        """Convert simple DFT model to categorized format."""
        if all_models is None:
            all_models = []
        
        subtype = simple_model.get("subtype", "")
        functional_obj = simple_model.get("functional")
        
        default_functionals = {
            "lda": "pz",
            "gga": "pbe",
            "hybrid": "b3lyp",
        }
        
        if not functional_obj:
            functional = default_functionals.get(subtype, "pbe")
        else:
            functional = safely_get_slug(functional_obj)
        
        path = f"/pb/qm/dft/ksdft/{subtype}?functional={functional}"
        
        # Find matching model in all_models
        for categorized in all_models:
            if categorized.get("path") == path:
                return SimplifiedCategorizedModel(
                    name=categorized.get("name", ""),
                    path=categorized.get("path", ""),
                    categories=categorized.get("categories", {}),
                    parameters=categorized.get("parameters", {}),
                )
        
        return None

    @classmethod
    def convert_ml_to_categorized(cls, simple_model: ModelConfig) -> SimplifiedCategorizedModel:
        """Convert simple ML model to categorized format."""
        subtype_obj = simple_model.get("subtype", "re")
        subtype = safely_get_slug(subtype_obj)
        
        return SimplifiedCategorizedModel(
            name="Regression",
            path="/st/det/ml/re/none",
            categories={
                "tier1": "st",
                "tier2": "det",
                "tier3": "ml",
                "type": subtype,
            },
            parameters={},
        )
