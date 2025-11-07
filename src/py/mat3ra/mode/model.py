"""Model class implementation."""

import copy
from typing import Any, Dict, List, Optional, Union

from mat3ra.code.entity import InMemoryEntity
from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry

from .default_models import DFTModelConfig
from .method import Method
from .methods.factory import MethodFactory
from .tree import MODEL_TREE, get_tree_by_application_name_and_version, tree_slug_to_named_object
from .types import MethodTreeBranch

EMPTY_BRANCH = MethodTreeBranch()


class Model(InMemoryEntity):
    """Model class representing a computational model."""

    def __init__(self, config: Dict[str, Any]):
        """Initialize Model.
        
        Args:
            config: Configuration dictionary with at least 'type' and 'subtype'
        """
        self._application = config.pop("application", None)
        method_config = config.pop("method", Method.get_default_config())
        
        super().__init__(config)
        self._json = config
        self._method_factory = MethodFactory
        self._method: Optional[Method] = None
        
        if method_config:
            self.set_prop("method", method_config)

    @property
    def type(self) -> str:
        """Get the model type."""
        return self.get_prop("type", "")

    @property
    def subtype(self) -> Any:
        """Get the model subtype."""
        return self.get_prop("subtype", "")

    @property
    def method(self) -> Dict[str, Any]:
        """Get the method configuration."""
        return self.get_prop("method", {})

    def set_subtype(self, subtype: Union[str, SlugifiedEntry]) -> None:
        """Set model subtype and update method accordingly."""
        self.set_prop("subtype", subtype)
        self.set_method(self._method_factory.create(self.default_method_config))

    @property
    def allowed_types(self) -> List[SlugifiedEntry]:
        """Get allowed model types."""
        return [tree_slug_to_named_object(slug) for slug in self.tree.keys()]

    @property
    def allowed_subtypes(self) -> List[SlugifiedEntry]:
        """Get allowed model subtypes."""
        return [tree_slug_to_named_object(slug) for slug in self.tree_branch_for_type.keys()]

    @property
    def default_type(self) -> str:
        """Get default model type."""
        types = self.allowed_types
        return types[0].slug if types else ""

    @property
    def default_subtype(self) -> str:
        """Get default model subtype."""
        subtypes = self.allowed_subtypes
        return subtypes[0].slug if subtypes else ""

    @property
    def tree(self) -> Dict[str, Any]:
        """Get the model tree."""
        if self._application:
            name = self._application.get("name")
            version = self._application.get("version")
            tree_by_app = get_tree_by_application_name_and_version(name, version)
            if tree_by_app:
                return tree_by_app
        return MODEL_TREE

    @property
    def tree_branch_for_type(self) -> Dict[str, Any]:
        """Get tree branch for current type."""
        return self.tree.get(self.type, {})

    @property
    def tree_branch_for_subtype(self) -> MethodTreeBranch:
        """Get tree branch for current subtype."""
        subtype_slug = self._subtype_slug
        branch_dict = self.tree_branch_for_type.get(subtype_slug, {})
        
        if not branch_dict:
            return EMPTY_BRANCH
        
        return MethodTreeBranch(
            methods=branch_dict.get("methods", {}),
            functionals=branch_dict.get("functionals", []),
            refiners=branch_dict.get("refiners", []),
            modifiers=branch_dict.get("modifiers", []),
        )

    @property
    def group_slug(self) -> str:
        """Get group slug for the model."""
        subtype = self._subtype_slug
        if not self._application:
            return f"{self.type}:{subtype}"
        short_name = self._application.get("shortName", "")
        return f"{short_name}:{self.type}:{subtype}"

    @property
    def Method(self) -> Method:
        """Get Method instance."""
        if not self._method:
            self._method = self._method_factory.create(self.method)
        return self._method

    def set_method(self, method: Method) -> None:
        """Set method instance."""
        self._method = method
        self.set_prop("method", method.to_json())

    @property
    def methods_from_tree(self) -> Dict[str, List[str]]:
        """Get methods from tree."""
        return self.tree_branch_for_subtype.methods

    @property
    def method_types(self) -> List[SlugifiedEntry]:
        """Get method types."""
        return [tree_slug_to_named_object(type_) for type_ in self.methods_from_tree.keys()]

    @property
    def method_subtypes(self) -> List[SlugifiedEntry]:
        """Get method subtypes."""
        method_obj = self.Method
        method_type = method_obj.type
        subtypes = self.methods_from_tree.get(method_type, [])
        return [tree_slug_to_named_object(slug) for slug in subtypes]

    @property
    def default_method_config(self) -> Dict[str, Any]:
        """Get default method configuration."""
        method_types = list(self.methods_from_tree.keys())
        if not method_types:
            return Method.get_default_config()
        
        method_type = method_types[0]
        subtypes = self.methods_from_tree.get(method_type, [])
        if not subtypes:
            return Method.get_default_config()
        
        return {"type": method_type, "subtype": subtypes[0]}

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        """Get default configuration."""
        return {
            **DFTModelConfig,
            "method": Method.get_default_config(),
        }

    @classmethod
    def get_all_types(cls) -> List[SlugifiedEntry]:
        """Get all model types."""
        return [tree_slug_to_named_object(slug) for slug in MODEL_TREE.keys()]

    def to_json(self) -> Dict[str, Any]:
        """Convert to JSON representation."""
        json_data = copy.deepcopy(self._json)
        return {
            **json_data,
            "type": self.type,
            "subtype": self.subtype,
            "method": self.Method.to_json_with_clean_data(),
        }

    def _string_to_slugified_object(self, slug: Union[str, SlugifiedEntry]) -> SlugifiedEntry:
        """Convert string to SlugifiedEntry."""
        if isinstance(slug, str):
            return tree_slug_to_named_object(slug)
        return slug

    @property
    def is_unknown(self) -> bool:
        """Check if model type is unknown."""
        return self.type == "unknown"

    @property
    def _subtype_slug(self) -> str:
        """Get subtype as slug string."""
        subtype = self.subtype
        if isinstance(subtype, dict):
            return subtype.get("slug", "")
        return str(subtype) if subtype else ""
