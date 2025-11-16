from typing import Any, Dict, Optional

from mat3ra.code.entity import InMemoryEntityPydantic
from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry
from mat3ra.esse.models.model import BaseModel1
from pydantic import Field

from .method import Method
from .methods.factory import MethodFactory


class Model(BaseModel1, InMemoryEntityPydantic):
    method: Method = Field(default_factory=Method)

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
    def group_slug(self) -> str:
        if not self.application:
            return f"{self.type}:{self.subtype}"
        short_name = self.application.get("shortName", "")
        return f"{short_name}:{self.type}:{self.subtype}"

    @property
    def is_unknown(self) -> bool:
        return self.type == "unknown"
