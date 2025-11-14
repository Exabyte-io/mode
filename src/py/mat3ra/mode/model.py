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
    """
    Model with strong-typed `method` (like `Basis.cell`), built from config at init.
    """
    # Public fields (normalized in __convert_kwargs__)
    type: str = ""
    # We keep subtype as a string slug internally (simplest + consistent)
    subtype: Union[str, SlugifiedEntry, Dict[str, Any]] = ""
    method: Method = Field(default_factory=Method)  # strong-typed after init

    # Optional application context (excluded from serialization, like Basis.cell in spirit)
    application: Optional[Dict[str, Any]] = Field(default=None, exclude=True)

    def __convert_kwargs__(self, **kwargs: Any) -> Dict[str, Any]:
        # Normalize method: allow dict/config and build strong-typed Method
        m = kwargs.get("method")
        if m is None or m == {}:
            kwargs["method"] = MethodFactory.create(Method.get_default_config())
        elif isinstance(m, dict):
            kwargs["method"] = MethodFactory.create(m)
        elif not isinstance(m, Method):
            # Defensive: allow passing an already-built Method; otherwise construct default
            kwargs["method"] = MethodFactory.create(Method.get_default_config())

        # Normalize subtype to a plain slug string
        st = kwargs.get("subtype")
        if isinstance(st, SlugifiedEntry):
            kwargs["subtype"] = st.slug
        elif isinstance(st, dict):
            kwargs["subtype"] = str(st.get("slug", ""))  # tolerate loose dicts
        elif st is None:
            kwargs["subtype"] = ""
        else:
            kwargs["subtype"] = str(st)

        # Normalize type to a plain slug string
        tp = kwargs.get("type")
        kwargs["type"] = "" if tp is None else str(tp)

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
        # return a config dict (like Basis.from_dict) — ctor will build Method instance
        return {**DFTModelConfig, "method": Method.get_default_config()}

    @classmethod
    def get_all_types(cls) -> List[SlugifiedEntry]:
        return [tree_slug_to_named_object(slug) for slug in MODEL_TREE.keys()]
