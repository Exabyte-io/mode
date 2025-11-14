from typing import Any, Dict, List, Optional, Union

from mat3ra.code.entity import InMemoryEntityPydantic
from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry
from mat3ra.esse.models.model import BaseModel
from pydantic import Field

from .default_models import DFTModelConfig
from .method import Method
from .methods.factory import MethodFactory
from .tree import MODEL_TREE, get_tree_by_application_name_and_version, tree_slug_to_named_object
from .types import MethodTreeBranch

EMPTY_BRANCH = MethodTreeBranch()


class Model(InMemoryEntityPydantic, BaseModel):
    type: str = ""
    subtype: Union[str, SlugifiedEntry, Dict[str, Any]] = ""
    method: Method = Field(default_factory=Method)  # strong-typed after init

    application: Optional[Dict[str, Any]] = Field(default=None, exclude=True)

    @staticmethod
    def _coerce_method(method: Any) -> Method:
        return method if isinstance(method, Method) else MethodFactory.create(method or Method.get_default_config())

    @staticmethod
    def _slugify(subtype: Any) -> str:
        if isinstance(subtype, SlugifiedEntry):
            return subtype.slug
        if isinstance(subtype, dict):
            return str(subtype.get("slug", ""))
        return "" if subtype is None else str(subtype)

    def __convert_kwargs__(self, **kwargs: Any) -> Dict[str, Any]:
        kwargs["method"] = Model._coerce_method(kwargs.get("method"))
        kwargs["subtype"] = Model._slugify(kwargs.get("subtype"))
        return kwargs

    def __init__(self, *args: Any, **kwargs: Any):
        kwargs = self.__convert_kwargs__(**kwargs)
        super().__init__(*args, **kwargs)

    @property
    def tree(self) -> Dict[str, Any]:
        if self.application:
            name = self.application.get("name")
            version = self.application.get("version")
            tree_by_app = get_tree_by_application_name_and_version(name, version)
            if tree_by_app:
                return tree_by_app
        return MODEL_TREE

    @property
    def allowed_types(self) -> List[SlugifiedEntry]:
        return [tree_slug_to_named_object(slug) for slug in self.tree.keys()]

    @property
    def default_type(self) -> str:
        return self.allowed_types[0].slug if self.allowed_types else ""

    @property
    def tree_branch_for_type(self) -> Dict[str, Any]:
        return self.tree.get(self.type, {})

    @property
    def allowed_subtypes(self) -> List[SlugifiedEntry]:
        return [tree_slug_to_named_object(slug) for slug in self.tree_branch_for_type.keys()]

    @property
    def default_subtype(self) -> str:
        return self.allowed_subtypes[0].slug if self.allowed_subtypes else ""

    @property
    def tree_branch_for_subtype(self) -> MethodTreeBranch:
        branch = self.tree_branch_for_type.get(self.subtype, {})
        if not branch:
            return EMPTY_BRANCH
        return MethodTreeBranch(
            methods=branch.get("methods", {}),
            functionals=branch.get("functionals", []),
            refiners=branch.get("refiners", []),
            modifiers=branch.get("modifiers", []),
        )

    @property
    def group_slug(self) -> str:
        if not self.application:
            return f"{self.type}:{self.subtype}"
        short_name = self.application.get("shortName", "")
        return f"{short_name}:{self.type}:{self.subtype}"

    @property
    def is_unknown(self) -> bool:
        return self.type == "unknown"

    @property
    def methods_from_tree(self) -> Dict[str, List[str]]:
        return self.tree_branch_for_subtype.methods

    @property
    def method_types(self) -> List[SlugifiedEntry]:
        return [tree_slug_to_named_object(kind) for kind in self.methods_from_tree.keys()]

    @property
    def method_subtypes(self) -> List[SlugifiedEntry]:
        mtype = self.method.type  # method is strong-typed
        return [tree_slug_to_named_object(s) for s in self.methods_from_tree.get(mtype, [])]

    @property
    def default_method_config(self) -> Dict[str, Any]:
        kinds = list(self.methods_from_tree.keys())
        if not kinds:
            return Method.get_default_config()
        first_kind = kinds[0]
        subtypes = self.methods_from_tree.get(first_kind, [])
        if not subtypes:
            return Method.get_default_config()
        return {"type": first_kind, "subtype": subtypes[0]}

    @classmethod
    def get_default_config(cls) -> Dict[str, Any]:
        return {**DFTModelConfig, "method": Method.get_default_config()}

    @classmethod
    def get_all_types(cls) -> List[SlugifiedEntry]:
        return [tree_slug_to_named_object(slug) for slug in MODEL_TREE.keys()]
