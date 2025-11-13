from typing import Any, Dict, List, Optional, Union

from mat3ra.code.entity import InMemoryEntityPydantic
from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry
from mat3ra.esse.models.model import BaseModel
from pydantic import Field

from .default_models import DFTModelConfig
from .method import Method
from .methods.factory import MethodFactory
from .tree import (
    MODEL_TREE,
    get_tree_by_application_name_and_version,
    tree_slug_to_named_object,
)
from .types import MethodTreeBranch

EMPTY_BRANCH = MethodTreeBranch()


class Model(InMemoryEntityPydantic, BaseModel):
    type: str = ""
    subtype: Union[str, SlugifiedEntry, Dict[str, Any]] = ""
    method: Dict[str, Any] = Field(default_factory=dict)

    # Private attributes for internal state
    _application: Optional[Dict[str, Any]] = None
    _method_factory: Any = MethodFactory
    _method: Optional[Method] = None

    @property
    def allowed_types(self) -> List[SlugifiedEntry]:

        return [tree_slug_to_named_object(slug) for slug in self.tree.keys()]

    @property
    def allowed_subtypes(self) -> List[SlugifiedEntry]:

        return [tree_slug_to_named_object(slug) for slug in self.tree_branch_for_type.keys()]

    @property
    def default_type(self) -> str:

        types = self.allowed_types
        return types[0].slug if types else ""

    @property
    def default_subtype(self) -> str:

        subtypes = self.allowed_subtypes
        return subtypes[0].slug if subtypes else ""

    @property
    def tree(self) -> Dict[str, Any]:

        if self._application:
            name = self._application.get("name")
            version = self._application.get("version")
            tree_by_app = get_tree_by_application_name_and_version(name, version)
            if tree_by_app:
                return tree_by_app
        return MODEL_TREE

    @property
    def tree_branch_for_type(self) -> Dict[str, Any]:

        return self.tree.get(self.type, {})

    @property
    def tree_branch_for_subtype(self) -> MethodTreeBranch:

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

        subtype = self._subtype_slug
        if not self._application:
            return f"{self.type}:{subtype}"
        short_name = self._application.get("shortName", "")
        return f"{short_name}:{self.type}:{subtype}"

    @property
    def Method(self) -> Method:

        if not self._method:
            method_config = self.method if self.method else Method.get_default_config()
            self._method = self._method_factory.create(method_config)
        return self._method

    @property
    def methods_from_tree(self) -> Dict[str, List[str]]:

        return self.tree_branch_for_subtype.methods

    @property
    def method_types(self) -> List[SlugifiedEntry]:

        return [tree_slug_to_named_object(type_) for type_ in self.methods_from_tree.keys()]

    @property
    def method_subtypes(self) -> List[SlugifiedEntry]:

        method_obj = self.Method
        method_type = method_obj.type
        subtypes = self.methods_from_tree.get(method_type, [])
        return [tree_slug_to_named_object(slug) for slug in subtypes]

    @property
    def default_method_config(self) -> Dict[str, Any]:

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

        return {
            **DFTModelConfig,
            "method": Method.get_default_config(),
        }

    @classmethod
    def get_all_types(cls) -> List[SlugifiedEntry]:

        return [tree_slug_to_named_object(slug) for slug in MODEL_TREE.keys()]

    def _string_to_slugified_object(self, slug: Union[str, SlugifiedEntry]) -> SlugifiedEntry:

        if isinstance(slug, str):
            return tree_slug_to_named_object(slug)
        return slug

    @property
    def is_unknown(self) -> bool:

        return self.type == "unknown"

    @property
    def _subtype_slug(self) -> str:

        subtype = self.subtype
        if isinstance(subtype, dict):
            return subtype.get("slug", "")
        return str(subtype) if subtype else ""
